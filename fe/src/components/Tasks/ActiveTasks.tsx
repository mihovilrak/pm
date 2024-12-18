import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getActiveTasks } from '../../api/tasks';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress
} from '@mui/material';
import { Task } from '../../types/task';

const ActiveTasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async (): Promise<void> => {
      try {
        const taskList = await getActiveTasks();
        setTasks(taskList);
      } catch (error) {
        console.error('Failed to fetch active tasks', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  if (loading) return <CircularProgress />;

  return (
    <Box sx={{ maxWidth: '800px', margin: '0 auto', padding: '16px' }}>
      <Typography variant="h4" gutterBottom>My Active Tasks</Typography>
      {tasks.length === 0 ? (
        <Typography>No active tasks assigned to you.</Typography>
      ) : (
        <Grid container spacing={2}>
          {tasks.map((task) => (
            <Grid item xs={12} sm={6} md={4} key={task.id}>
              <Card 
                onClick={() => navigate(`/tasks/${task.id}`)} 
                sx={{ cursor: 'pointer' }}
              >
                <CardContent>
                  <Typography variant="h6">{task.name}</Typography>
                  <Typography variant="body2">Project: {task.project_name}</Typography>
                  <Typography variant="body2">Priority: {task.priority}</Typography>
                  <Typography variant="caption">
                    Due: {new Date(task.due_date).toLocaleDateString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default ActiveTasks; 