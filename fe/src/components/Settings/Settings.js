import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Alert
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import UserTable from './UserTable';
import UserDialog from './UserDialog';
import { getAllUsers } from '../../api/users';
import ActivityTypeDialog from './ActivityTypeDialog';
import ActivityTypeList from './ActivityTypeList';
import { getAllActivityTypes } from '../../api/activityTypes';

const Settings = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [activityTypes, setActivityTypes] = useState([]);
  const [activityTypeDialogOpen, setActivityTypeDialogOpen] = useState(false);
  const [selectedActivityType, setSelectedActivityType] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersData, activityTypesData] = await Promise.all([
          getAllUsers(),
          getAllActivityTypes()
        ]);
        setUsers(usersData);
        setActivityTypes(activityTypesData);
      } catch (error) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCreateUser = () => {
    setSelectedUser(null);
    setDialogOpen(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedUser(null);
  };

  const handleUserSaved = () => {
    handleDialogClose();
    fetchUsers();
  };

  const handleCreateActivityType = () => {
    setSelectedActivityType(null);
    setActivityTypeDialogOpen(true);
  };

  const handleEditActivityType = (activityType) => {
    setSelectedActivityType(activityType);
    setActivityTypeDialogOpen(true);
  };

  const handleActivityTypeSaved = () => {
    setActivityTypeDialogOpen(false);
    setSelectedActivityType(null);
    fetchActivityTypes();
  };

  if (!user?.is_admin) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          You don't have permission to access this page.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 3 
        }}>
          <Typography variant="h5">User Management</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateUser}
          >
            Create User
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <UserTable 
            users={users} 
            onEditUser={handleEditUser}
            onUserDeleted={fetchUsers}
          />
        )}
      </Paper>

      <UserDialog
        open={dialogOpen}
        user={selectedUser}
        onClose={handleDialogClose}
        onSaved={handleUserSaved}
      />

      <Paper sx={{ p: 3, mt: 3 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 3 
        }}>
          <Typography variant="h5">Activity Types</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateActivityType}
          >
            Create Activity Type
          </Button>
        </Box>

        <ActivityTypeList
          activityTypes={activityTypes}
          onEdit={handleEditActivityType}
          onActivityTypeUpdated={() => fetchActivityTypes()}
        />

        <ActivityTypeDialog
          open={activityTypeDialogOpen}
          activityType={selectedActivityType}
          onClose={() => {
            setActivityTypeDialogOpen(false);
            setSelectedActivityType(null);
          }}
          onSaved={() => {
            setActivityTypeDialogOpen(false);
            setSelectedActivityType(null);
            fetchActivityTypes();
          }}
        />
      </Paper>
    </Box>
  );
};

export default Settings; 