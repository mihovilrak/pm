create or replace function create_task(
    p_name character varying,
    p_description text,
    p_start_date date,
    p_due_date date,
    p_priority_id integer,
    p_status_id integer,
    p_type_id integer,
    p_parent_id integer,
    p_project_id integer,
    p_holder_id integer,
    p_assignee_id integer,
    p_created_by integer,
    p_tag_ids integer[]
) returns table(
    message text
) as $$

    declare
        v_task_id integer;

    begin
        -- Basic validation
        if p_name is null then
            return query select 'Task name cannot be null'::text;
            return;
        end if;

        -- Insert the task and get the new ID
        insert into tasks (
            name,
            description,
            start_date,
            due_date,
            priority_id,
            status_id,
            type_id,
            parent_id,
            project_id,
            holder_id,
            assignee_id,
            created_by
        ) values (
            p_name,
            p_description,
            p_start_date,
            p_due_date,
            p_priority_id,
            p_status_id,
            p_type_id,
            p_parent_id,
            p_project_id,
            p_holder_id,
            p_assignee_id,
            p_created_by
        ) returning id into v_task_id;

        -- Insert tags if provided
        if p_tag_ids is not null then
            insert into task_tags (task_id, tag_id) 
            values (v_task_id, unnest(p_tag_ids));
        end if;

        -- Return success message
        return query 
        select 'Task '
        || p_name 
        || ' created successfully' as message;
    exception
        when others then
            return query select 'Could not create task' as message;
    end;

$$ language plpgsql;