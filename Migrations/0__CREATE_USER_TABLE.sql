create table users (
    id uuid primary key,
    username varchar(22) not null unique,
    password text
);