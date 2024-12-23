// Get all projects
exports.getProjects = async (pool, whereParams) => {
  let query = 'SELECT * FROM projects';
  let values = [];

  if (whereParams && Object.keys(whereParams).length > 0) {
    query += ' WHERE ';
    const conditions = [];

    Object.keys(whereParams).forEach((param, index) => {
      conditions.push(`${param} = $${index + 1}`);
      values.push(whereParams[param]);
    });

    query += conditions.join(' AND ');
  }

  const result = await pool.query(query, values);
  return result.rows;
};

// Get a project by ID
exports.getProjectById = async (pool, id) => {
  const result = await pool.query(
    `SELECT * FROM projects 
    WHERE id = $1`,
    [id]
  );
  return result.rows[0];
};

// Get project details
exports.getProjectDetails = async (pool, id) => {
  const result = await pool.query(
    `SELECT * FROM project_details($1)`,
    [id]
  );
  return result.rows[0];
};

// Create a new project
exports.createProject = async (
  pool, 
  name, 
  description, 
  start_date, 
  due_date, 
  created_by
) => {
  const result = await pool.query(
    `INSERT INTO projects 
    (name, description, start_date, due_date, created_by) 
    VALUES ($1, $2, $3, $4, $5) 
    RETURNING *`,
    [name, description, start_date, due_date, created_by]
  );
  return result.rows[0];
};

// Change a project status
exports.changeProjectStatus = async (pool, id) => {
  const result = await pool.query(
    `SELECT * FROM change_project_status($1)`,
      [id]
    );
    return result.rows[0];
  };

// Update a project
exports.updateProject = async (pool, updates, id) => {
  const columns = Object.keys(updates);
  const values = Object.values(updates);
  
  let query = `UPDATE projects SET (${columns.join(', ')}) = 
  (${columns.map((_, index) => `$${index + 1}`).join(', ')})`;
  
  query += ` WHERE id = $${columns.length + 1}`;
  
  values.push(id);
  
  const result = await pool.query(query, values);
  return result.rowCount;
};
  
// Delete a project
exports.deleteProject = async (pool, id) => {
  const result = await pool.query(
    `SELECT * FROM delete_project($1)`, 
      [id]);

    return result.rows[0];
  };
  
// Get project members
exports.getProjectMembers = async (pool, projectId) => {
  const result = await pool.query(
    `SELECT * FROM v_project_members 
    WHERE project_id = $1`,
      [projectId]
    );
    return result.rows;
};

// Get subprojects
exports.getSubprojects = async (pool, parentId) => {
  const result = await pool.query(
    `SELECT * FROM v_subprojects 
    WHERE parent_id = $1`,
      [parentId]
    );
    return result.rows;
  };

// Add project member
exports.addProjectMember = async (pool, projectId, userId) => {
  const result = await pool.query(
    `INSERT INTO project_users 
    (project_id, user_id) 
    VALUES ($1, $2) 
    RETURNING *`,
      [projectId, userId]
    );
    return result.rows[0];
  };

// Delete project member
exports.deleteProjectMember = async (pool, projectId, userId) => {
  const result = await pool.query(
    `DELETE FROM project_users 
    WHERE project_id = $1 
    AND user_id = $2`,
      [projectId, userId]
    );
    return result.rowCount;
  };

// Create a subproject
exports.createSubproject = async (
  pool, 
  name, 
  description, 
  start_date, 
  due_date, 
  parent_id,
  created_by
) => {
  const result = await pool.query(
    `INSERT INTO projects (
      name, 
      description, 
      start_date, 
      due_date, 
      parent_id, 
      created_by
      ) VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING *`,
      [name, description, start_date, due_date, parent_id, created_by]
    );
    return result.rows[0];
  };

// Get project tasks
exports.getProjectTasks = async (pool, id, filters = {}) => {
  const query = `
    SELECT * FROM v_tasks 
    WHERE project_id = $1 
    ${Object.keys(filters).length > 0 
      ? `AND ${Object.keys(filters).map((key, index) => `${key} = $${index + 2}`).join(' AND ')}` 
      : ''}
    ORDER BY created_on DESC
  `;
  
  const values = [id, ...Object.values(filters)];
  const result = await pool.query(query, values);
  return result.rows;
};
  