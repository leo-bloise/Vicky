CREATE TABLE counterparties (
    id uuid PRIMARY KEY,
    name TEXT NOT NULL,
    user_id uuid NOT NULL REFERENCES users(id)
);