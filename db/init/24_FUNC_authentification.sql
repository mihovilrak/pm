create or replace function authentification (
    auth_login character varying, 
    auth_password character varying
)
returns table (
    id integer, 
    login character varying, 
    password character varying, 
    role_id integer
) as $$

begin
    return query
    select  u.id,
            u.login,
            u.password,
            u.role_id
    from users u
    where u.login = auth_login
    and u.password = crypt(auth_password, u.password);
end;

$$ language plpgsql;