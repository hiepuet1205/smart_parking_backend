import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateStatusParkingSlot1733797787282 implements MigrationInterface {
    name = 'UpdateStatusParkingSlot1733797787282'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."parking_slots_status_enum" RENAME TO "parking_slots_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."parking_slots_status_enum" AS ENUM('AVAILABLE', 'UNAVAILABLE', 'TEMP_UNAVAILABLE')`);
        await queryRunner.query(`ALTER TABLE "parking_slots" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "parking_slots" ALTER COLUMN "status" TYPE "public"."parking_slots_status_enum" USING "status"::"text"::"public"."parking_slots_status_enum"`);
        await queryRunner.query(`ALTER TABLE "parking_slots" ALTER COLUMN "status" SET DEFAULT 'AVAILABLE'`);
        await queryRunner.query(`DROP TYPE "public"."parking_slots_status_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."parking_slots_status_enum_old" AS ENUM('AVAILABLE', 'NOT_AVAILABLE')`);
        await queryRunner.query(`ALTER TABLE "parking_slots" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "parking_slots" ALTER COLUMN "status" TYPE "public"."parking_slots_status_enum_old" USING "status"::"text"::"public"."parking_slots_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "parking_slots" ALTER COLUMN "status" SET DEFAULT 'AVAILABLE'`);
        await queryRunner.query(`DROP TYPE "public"."parking_slots_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."parking_slots_status_enum_old" RENAME TO "parking_slots_status_enum"`);
    }

}
