import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserPhone1752064183301 implements MigrationInterface {
    name = 'AddUserPhone1752064183301'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "phone" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "phone"`);
    }

}
