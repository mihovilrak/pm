create table if not exists roles (
    id serial primary key not null,
    role varchar(50) unique not null,
    description text null,
    is_active boolean default true not null,
    created_on timestamptz default current_timestamp not null
);