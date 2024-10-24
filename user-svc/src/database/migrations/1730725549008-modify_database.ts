import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifyDatabase1730725549008 implements MigrationInterface {
    name = 'ModifyDatabase1730725549008'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."payments_accounttype_enum" AS ENUM('card', 'account')`);
        await queryRunner.query(`CREATE TABLE "payments" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "bankCode" character varying NOT NULL, "accountNo" character varying NOT NULL, "accountName" character varying NOT NULL, "accountType" "public"."payments_accounttype_enum" NOT NULL, CONSTRAINT "PK_197ab7af18c93fbb0c9b28b4a59" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."withdrawal_requests_status_enum" AS ENUM('PENDING', 'ERROR', 'SUCCESS')`);
        await queryRunner.query(`CREATE TABLE "withdrawal_requests" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "amount" integer NOT NULL, "status" "public"."withdrawal_requests_status_enum" NOT NULL DEFAULT 'PENDING', "user_id" integer, CONSTRAINT "PK_e1b3734a3f3cbd46bf0ad7eedb6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" ADD "totalEarning" double precision`);
        await queryRunner.query(`ALTER TABLE "users" ADD "totalAmountWithdraw" double precision`);
        await queryRunner.query(`ALTER TABLE "users" ADD "firebaseDeviceTokens" text array`);
        await queryRunner.query(`ALTER TABLE "users" ADD "paymentId" integer`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_c770867cf114e3876d9c2628203" UNIQUE ("paymentId")`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_c770867cf114e3876d9c2628203" FOREIGN KEY ("paymentId") REFERENCES "payments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "withdrawal_requests" ADD CONSTRAINT "FK_59e24608606734b3ebcfd9fee84" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "withdrawal_requests" DROP CONSTRAINT "FK_59e24608606734b3ebcfd9fee84"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_c770867cf114e3876d9c2628203"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_c770867cf114e3876d9c2628203"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "paymentId"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "firebaseDeviceTokens"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "totalAmountWithdraw"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "totalEarning"`);
        await queryRunner.query(`DROP TABLE "withdrawal_requests"`);
        await queryRunner.query(`DROP TYPE "public"."withdrawal_requests_status_enum"`);
        await queryRunner.query(`DROP TABLE "payments"`);
        await queryRunner.query(`DROP TYPE "public"."payments_accounttype_enum"`);
    }

}
