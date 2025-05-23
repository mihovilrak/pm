import React from 'react';
import { Box, Button } from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { ProjectActionsProps } from '../../types/project';

const ProjectActions: React.FC<ProjectActionsProps> = ({
  canEdit,
  canDelete,
  onEdit,
  onDelete
}) => {
  return (
    <Box>
      {canEdit && (
        <Button
          startIcon={<EditIcon />}
          onClick={onEdit}
          sx={{ mr: 1 }}
          data-testid="edit-project-button"
        >
          Edit
        </Button>
      )}
      {canDelete && (
        <Button
          startIcon={<DeleteIcon />}
          color="error"
          onClick={onDelete}
          data-testid="delete-project-button"
        >
          Delete
        </Button>
      )}
    </Box>
  );
};

export default ProjectActions;
