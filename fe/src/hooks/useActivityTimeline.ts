import { Activity } from '../types/profile';
import {
  Task as TaskIcon,
  Comment as CommentIcon,
  InsertDriveFile as FileIcon,
  Edit as EditIcon
} from '@mui/icons-material';

export const useActivityTimeline = () => {
  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'task': return TaskIcon;
      case 'comment': return CommentIcon;
      case 'file': return FileIcon;
      case 'edit': return EditIcon;
      default: return TaskIcon;
    }
  };

  const getActivityColor = (type: Activity['type']): 'primary' | 'success' | 'info' | 'warning' => {
    switch (type) {
      case 'task': return 'primary';
      case 'comment': return 'success';
      case 'file': return 'info';
      case 'edit': return 'warning';
      default: return 'primary';
    }
  };

  return {
    getActivityIcon,
    getActivityColor
  };
}; 