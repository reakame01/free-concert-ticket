import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1740000000000 implements MigrationInterface {
  name = 'InitialSchema1740000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

    await queryRunner.query(`
      CREATE TYPE "role_enum" AS ENUM ('ADMIN', 'USER');
      CREATE TYPE "reservation_status_enum" AS ENUM ('ACTIVE', 'CANCELLED');
      CREATE TYPE "history_action_enum" AS ENUM ('Reserve', 'Cancel', 'Delete');
    `);

    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "username" character varying(100) NOT NULL,
        "password_hash" character varying(255) NOT NULL,
        "role" "role_enum" NOT NULL DEFAULT 'USER',
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "PK_users" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_users_username" UNIQUE ("username")
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "concerts" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying(255) NOT NULL,
        "description" text NOT NULL,
        "total_seats" integer NOT NULL,
        "reserved_count" integer NOT NULL DEFAULT 0,
        "cancelled_count" integer NOT NULL DEFAULT 0,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "PK_concerts" PRIMARY KEY ("id")
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "reservations" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "concert_id" uuid NOT NULL,
        "status" "reservation_status_enum" NOT NULL DEFAULT 'ACTIVE',
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "PK_reservations" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_reservations_user_concert" UNIQUE ("user_id", "concert_id"),
        CONSTRAINT "FK_reservations_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_reservations_concert" FOREIGN KEY ("concert_id") REFERENCES "concerts"("id") ON DELETE CASCADE
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "history_logs" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "concert_id" uuid,
        "username" character varying(100) NOT NULL,
        "concert_name" character varying(255) NOT NULL,
        "action" "history_action_enum" NOT NULL,
        "date_time" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "PK_history_logs" PRIMARY KEY ("id"),
        CONSTRAINT "FK_history_logs_concert" FOREIGN KEY ("concert_id") REFERENCES "concerts"("id") ON DELETE SET NULL
      );
    `);

    await queryRunner.query(`
      INSERT INTO "users" ("username", "password_hash", "role")
      VALUES ('admin', '$2b$10$rcNfJvxXdNbgyOMNI8ukuOh/EEeUXaA62NGqlODdkF8ItjmSHRHUC', 'ADMIN');
    `);

    await queryRunner.query(`
      INSERT INTO "concerts" ("name", "description", "total_seats", "reserved_count", "cancelled_count")
      VALUES
        (
          'Concert Name 1',
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
          500,
          120,
          12
        ),
        (
          'Concert Name 2',
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
          200,
          0,
          0
        );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "history_logs"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "reservations"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "concerts"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "users"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "history_action_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "reservation_status_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "role_enum"`);
  }
}
