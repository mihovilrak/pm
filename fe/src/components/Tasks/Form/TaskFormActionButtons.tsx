import React from 'react';
import { Box, Button } from '@mui/material';
import { TaskFormActionButtonsProps } from '../../../types/task';

export const TaskFormActionButtons: React.FC<TaskFormActionButtonsProps> = ({
  isEditing,
  onCancel
}) => (
  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
    <Button
      type="button"
      data-testid="cancel-button"
      onClick={() => {
        console.log('Cancel clicked');
        (onCancel || (() => window.history.back()))();
      }}
      color="inherit"
    >
      Cancel
    </Button>
    <Button type="submit" variant="contained" color="primary">
      {isEditing ? 'Update Task' : 'Create Task'}
    </Button>
  </Box>
);
