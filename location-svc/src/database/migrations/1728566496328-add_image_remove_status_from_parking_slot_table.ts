import { MigrationInterface, QueryRunner } from "typeorm";

export class AddImageRemoveStatusFromParkingSlotTable1728566496328 implements MigrationInterface {
    name = 'AddImageRemoveStatusFromParkingSlotTable1728566496328'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "parking_slots" RENAME COLUMN "status" TO "image"`);
        await queryRunner.query(`ALTER TYPE "public"."parking_slots_status_enum" RENAME TO "parking_slots_image_enum"`);
        await queryRunner.query(`ALTER TABLE "parking_slots" DROP COLUMN "image"`);
        await queryRunner.query(`ALTER TABLE "parking_slots" ADD "image" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "parking_slots" DROP COLUMN "image"`);
        await queryRunner.query(`ALTER TABLE "parking_slots" ADD "image" "public"."parking_slots_image_enum" NOT NULL DEFAULT 'AVAILABLE'`);
        await queryRunner.query(`ALTER TYPE "public"."parking_slots_image_enum" RENAME TO "parking_slots_status_enum"`);
        await queryRunner.query(`ALTER TABLE "parking_slots" RENAME COLUMN "image" TO "status"`);
    }

}
