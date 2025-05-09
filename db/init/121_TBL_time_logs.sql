create table if not exists time_logs (
    id serial primary key not null,
    task_id int references tasks(id) on delete cascade not null,
    user_id int references users(id) not null,
    log_date date default current_date not null,
    spent_time numeric(5, 2) not null,
    description text not null,
    activity_type_id int references activity_types(id) not null,
    updated_on timestamptz default current_timestamp null,
    created_on timestamptz default current_timestamp not null,
    check (spent_time >= 0)
);

create index if not exists time_logs_task_idx on time_logs(task_id);
create index if not exists time_logs_user_idx on time_logs(user_id);
create index if not exists time_logs_activity_type_idx on time_logs(activity_type_id);