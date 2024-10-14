import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStatusToSlot1729085292685 implements MigrationInterface {
    name = 'AddStatusToSlot1729085292685'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."parking_slots_status_enum" AS ENUM('AVAILABLE', 'NOT_AVAILABLE')`);
        await queryRunner.query(`ALTER TABLE "parking_slots" ADD "status" "public"."parking_slots_status_enum" NOT NULL DEFAULT 'AVAILABLE'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "parking_slots" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."parking_slots_status_enum"`);
    }

}
