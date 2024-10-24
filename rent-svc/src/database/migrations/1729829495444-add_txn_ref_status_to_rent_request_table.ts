import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTxnRefStatusToRentRequestTable1729829495444 implements MigrationInterface {
    name = 'AddTxnRefStatusToRentRequestTable1729829495444'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."rent_request_status_enum" AS ENUM('PENDING', 'COMPLETED', 'CANCELLED')`);
        await queryRunner.query(`CREATE TABLE "rent_request" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "slot_id" integer NOT NULL, "start_time" TIMESTAMP NOT NULL, "end_time" TIMESTAMP NOT NULL, "vehicle_id" integer NOT NULL, "user_id" integer NOT NULL, "price_per_hour" integer NOT NULL, "deposit_amount" integer NOT NULL, "txn_ref" character varying NOT NULL, "status" "public"."rent_request_status_enum" NOT NULL DEFAULT 'PENDING', CONSTRAINT "PK_4c1acbc8192762e542261575b45" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "rent_request"`);
        await queryRunner.query(`DROP TYPE "public"."rent_request_status_enum"`);
    }

}
