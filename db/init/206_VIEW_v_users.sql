create or replace view v_users as
    select  u.id,
            u.login,
            u.name,
            u.surname,
            u.email,
            u.role_id,
            s.name as status,
            r.name as role,
            u.created_on::timestamp(0),
            u.updated_on::timestamp(0),
            l.logged_on::timestamp(0) as last_login
    from users u
    left join user_statuses s on s.id = u.status_id
    left join roles r on r.id = u.role_id
    left join v_last_login l on l.user_id = u.id and l.login_rn = 1;