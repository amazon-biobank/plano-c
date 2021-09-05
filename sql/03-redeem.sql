CREATE SCHEMA IF NOT EXISTS public;

CREATE TABLE IF NOT EXISTS redeems (
    id                  VARCHAR(64) PRIMARY KEY,
    declaration_id      VARCHAR REFERENCES declarations(id),
    redeemer            VARCHAR REFERENCES users(id),
    last_hash           VARCHAR(64),
    last_hash_index     INT,
    entry_state         STATE_TYPE DEFAULT 'active',
    redeemed_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_timestamp_redeems
BEFORE UPDATE ON redeems
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();