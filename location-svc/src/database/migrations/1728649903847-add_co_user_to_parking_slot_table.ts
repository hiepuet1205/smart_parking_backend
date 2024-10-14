import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCoUserToParkingSlotTable1728649903847 implements MigrationInterface {
    name = 'AddCoUserToParkingSlotTable1728649903847'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "parking_slots" ADD "co_user_id" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "parking_slots" DROP COLUMN "co_user_id"`);
    }

}
