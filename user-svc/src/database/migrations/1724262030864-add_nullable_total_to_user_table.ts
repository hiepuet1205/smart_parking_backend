import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNullableTotalToUserTable1724262030864 implements MigrationInterface {
    name = 'AddNullableTotalToUserTable1724262030864'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "total" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "total" SET NOT NULL`);
    }

}
