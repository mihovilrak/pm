create table if not exists projects (
    id serial primary key not null,
    name varchar(50) not null,
    description text null,
    start_date date not null,
    end_date date null,
    due_date date not null,
    status_id int references project_statuses(id) default 1 not null,
    created_by int references users(id) not null,
    created_on timestamptz default current_timestamp not null
);
create index project_created_by_idx on projects(created_by);
create index project_status_idx on projects(status_id);