create or replace view v_project_progress as
    select project_id as id,
           round(count(case when status = 'Done' then 1 end) 
                 * 100.0 / nullif(count(*), 0)) as progress
    from v_tasks
    where status not in ('Deleted', 'Cancelled')
    group by project_id;
