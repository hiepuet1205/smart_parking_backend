import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPointToLocationTable1729020871184 implements MigrationInterface {
    name = 'AddPointToLocationTable1729020871184'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "locations" ADD "point" geography(Point,4326)`);
        await queryRunner.query(`CREATE INDEX "IDX_2297494d7bfbc35040bd9c7e76" ON "locations" USING GiST ("point") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_2297494d7bfbc35040bd9c7e76"`);
        await queryRunner.query(`ALTER TABLE "locations" DROP COLUMN "point"`);
    }

}
