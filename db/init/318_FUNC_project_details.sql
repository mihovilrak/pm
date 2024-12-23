create or replace function project_details(
    proj_id integer
)
returns table (
    id integer,
    name character varying,
    description text,
    start_date date,
    end_date date,
    due_date date,
    parent_id integer,
    parent_name character varying,
    status_id integer,
    status_name character varying,
    created_by integer,
    created_by_name character varying,
    created_on timestamptz,
    estimated_time numeric,
    spent_time numeric,
    progress numeric
) as $$

declare
    proj_estimated_time numeric;

begin

    select sum(t.estimated_time)
    into proj_estimated_time
    from tasks t
    where t.project_id = proj_id;

    return query
        select p.id,
               p.name,
               p.description,
               p.start_date,
               p.end_date,
               p.due_date,
               p.parent_id,
               pt.name as parent_name,
               p.status_id,
               ps.name as status_name,
               p.created_by,
               u.name as created_by_name,
               p.created_on,
               coalesce(proj_estimated_time, 0) as estimated_time,
               coalesce(pst.spent_time, 0) as spent_time,
               coalesce(pp.progress, 0) as progress
          from projects p
          left join projects pt on pt.id = p.parent_id
          left join project_statuses ps on ps.id = p.status_id
          left join users u on u.id = p.created_by
          left join v_project_spent_time pst on pst.id = p.id
          left join v_project_progress pp on pp.id = p.id
          where p.id = proj_id;
end;
$$ language plpgsql;