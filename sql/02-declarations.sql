CREATE SCHEMA IF NOT EXISTS public;

CREATE TABLE IF NOT EXISTS declarations (
    id                  VARCHAR(64) PRIMARY KEY,
    magnetic_link       VARCHAR(256),
    payer_fingerprint   VARCHAR REFERENCES users(id),
    value_frozen        FLOAT,
    available_funds     FLOAT,
    entry_state         STATE_TYPE DEFAULT 'active',
    expiration_date     DATE,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_timestamp_declarations
BEFORE UPDATE ON declarations
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();