CREATE SCHEMA IF NOT EXISTS public;
CREATE EXTENSION pgcrypto;

DO $$ BEGIN
    CREATE TYPE USER_TYPE AS ENUM (
        'user',
        'admin'
        );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE STATE_TYPE AS ENUM (
        'active',
        'deleted'
        );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS users (
    id              VARCHAR(64) PRIMARY KEY,
    username        VARCHAR(30),
    balance         FLOAT,
    public_key      VARCHAR(2048),
    entry_state     STATE_TYPE DEFAULT 'active',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_timestamp_users
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();