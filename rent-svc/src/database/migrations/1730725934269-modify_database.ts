import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifyDatabase1730725934269 implements MigrationInterface {
    name = 'ModifyDatabase1730725934269'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rent_request" ADD "owner_id" integer`);
        await queryRunner.query(`ALTER TABLE "rent_request" ADD "co_owner_id" integer`);
        await queryRunner.query(`ALTER TYPE "public"."rent_request_status_enum" RENAME TO "rent_request_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."rent_request_status_enum" AS ENUM('PENDING', 'COMPLETED', 'CANCELLED', 'PAID', 'REFUNDED')`);
        await queryRunner.query(`ALTER TABLE "rent_request" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "rent_request" ALTER COLUMN "status" TYPE "public"."rent_request_status_enum" USING "status"::"text"::"public"."rent_request_status_enum"`);
        await queryRunner.query(`ALTER TABLE "rent_request" ALTER COLUMN "status" SET DEFAULT 'PENDING'`);
        await queryRunner.query(`DROP TYPE "public"."rent_request_status_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."rent_request_status_enum_old" AS ENUM('PENDING', 'COMPLETED', 'CANCELLED')`);
        await queryRunner.query(`ALTER TABLE "rent_request" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "rent_request" ALTER COLUMN "status" TYPE "public"."rent_request_status_enum_old" USING "status"::"text"::"public"."rent_request_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "rent_request" ALTER COLUMN "status" SET DEFAULT 'PENDING'`);
        await queryRunner.query(`DROP TYPE "public"."rent_request_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."rent_request_status_enum_old" RENAME TO "rent_request_status_enum"`);
        await queryRunner.query(`ALTER TABLE "rent_request" DROP COLUMN "co_owner_id"`);
        await queryRunner.query(`ALTER TABLE "rent_request" DROP COLUMN "owner_id"`);
    }

}
