import { MigrationInterface, QueryRunner } from "typeorm";

export class InitModel1724314284062 implements MigrationInterface {
    name = 'InitModel1724314284062'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "locations" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "location" character varying NOT NULL, "long" double precision NOT NULL, "lat" double precision NOT NULL, "user_id" integer NOT NULL, "image" character varying NOT NULL, CONSTRAINT "UQ_dbf41576612e74b0ec1f698c07d" UNIQUE ("location"), CONSTRAINT "PK_7cc1c9e3853b94816c094825e74" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."parking_slots_status_enum" AS ENUM('AVAILABLE', 'NOT_AVAILABLE')`);
        await queryRunner.query(`CREATE TABLE "parking_slots" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "extractLocation" character varying NOT NULL, "priceHour" double precision NOT NULL, "status" "public"."parking_slots_status_enum" NOT NULL DEFAULT 'AVAILABLE', "user_id" integer NOT NULL, "location_id" integer, CONSTRAINT "PK_5250ec7083edc7c3491b72a0a50" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "parking_slots" ADD CONSTRAINT "FK_fcaa949a6d013f073714fe113cc" FOREIGN KEY ("location_id") REFERENCES "locations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "parking_slots" DROP CONSTRAINT "FK_fcaa949a6d013f073714fe113cc"`);
        await queryRunner.query(`DROP TABLE "parking_slots"`);
        await queryRunner.query(`DROP TYPE "public"."parking_slots_status_enum"`);
        await queryRunner.query(`DROP TABLE "locations"`);
    }

}
