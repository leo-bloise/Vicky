CREATE TABLE ledger (
    id uuid PRIMARY KEY,
    amount NUMERIC(13,4) NOT NULL,
    counterparty_id uuid not null REFERENCES counterparties(id),
    user_id uuid not null REFERENCES users(id),
    transaction_date timestamp with time zone not null
);