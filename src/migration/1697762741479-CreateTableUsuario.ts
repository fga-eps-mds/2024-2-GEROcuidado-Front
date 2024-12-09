import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableUsuario1697762741479 implements MigrationInterface {
  name = 'CreateTableUsuario1697762741479';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "usuario" ("id" SERIAL NOT NULL, "nome" character varying(60) NOT NULL, "foto" bytea, "email" character varying(100) NOT NULL, "senha" character varying(100) NOT NULL, "admin" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_2863682842e688ca198eb25c124" UNIQUE ("email"), CONSTRAINT "PK_a56c58e5cabaa04fb2c98d2d7e2" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "usuario"`);
  }
}
