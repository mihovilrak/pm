create or replace function delete_project(project_id integer) returns table(message text) as $$
    begin

        -- Update the active status of the given project 
        update projects 
        set active = 3 
        where id = $1;

        -- Return message query
        return query
            select 
                concat(
                    'Project ', 
                    name, 
                    ' deleted.'
                ) as message
            from projects 
            where id = $1;

    end;
$$ language plpgsql;