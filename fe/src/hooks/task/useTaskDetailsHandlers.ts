import { useState } from 'react';
import { Task, TaskStatus, TaskDetailsState } from '../../types/task';
import { Comment } from '../../types/comment';
import { TimeLog, TimeLogCreate } from '../../types/timeLog';

export const useTaskDetailsHandlers = () => {
  const [state, setState] = useState<TaskDetailsState>({
    statusMenuAnchor: null,
    editingComment: null,
    timeLogDialogOpen: false,
    selectedTimeLog: null,
    watcherDialogOpen: false
  });

  // Status Menu Handlers
  const handleStatusMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setState(prev => ({ ...prev, statusMenuAnchor: event.currentTarget }));
  };

  const handleStatusMenuClose = () => {
    setState(prev => ({ ...prev, statusMenuAnchor: null }));
  };

  const handleStatusChange = (statusId: number, statuses: TaskStatus[], onStatusChange: (statusId: number) => Promise<void>) => {
    onStatusChange(statusId);
    handleStatusMenuClose();
  };

  // Comment Handlers
  const handleSaveComment = async (
    commentId: number,
    newText: string,
    onCommentUpdate: (commentId: number, text: string) => Promise<void>
  ) => {
    await onCommentUpdate(commentId, newText);
    setState(prev => ({ ...prev, editingComment: null }));
  };

  const handleEditStart = (comment: Comment | null) => {
    setState(prev => ({ ...prev, editingComment: comment }));
  };

  // Time Log Handlers
  const handleTimeLogSubmit = async (
    timeLogData: TimeLogCreate,
    onSubmit: (data: TimeLogCreate) => Promise<void>
  ) => {
    try {
      await onSubmit(timeLogData);
      setState(prev => ({ ...prev, timeLogDialogOpen: false, selectedTimeLog: null }));
    } catch (error) {
      console.error('Error handling time log:', error);
      setState(prev => ({ ...prev, timeLogDialogOpen: true }));
    }
  };


  const handleTimeLogEdit = (timeLog: TimeLog) => {
    setState(prev => ({
      ...prev,
      selectedTimeLog: timeLog,
      timeLogDialogOpen: true
    }));
  };

  const handleTimeLogDialogClose = () => {
    setState(prev => ({
      ...prev,
      selectedTimeLog: null,
      timeLogDialogOpen: false
    }));
  };

  // Subtask Handlers
  const handleAddSubtaskClick = (task: Task, navigate: (path: string) => void) => {
    if (task) {
      navigate(`/tasks/new?projectId=${task.project_id}&parentId=${task.id}`);
    }
  };

  const handleSubtaskUpdate = (
    subtasks: Task[],
    subtaskId: number,
    updatedSubtask: Task,
    setSubtasks: (subtasks: Task[]) => void
  ) => {
    setSubtasks(subtasks.map(subtask =>
      subtask.id === subtaskId ? updatedSubtask : subtask
    ));
  };

  const handleSubtaskDelete = (
    subtasks: Task[],
    subtaskId: number,
    setSubtasks: (subtasks: Task[]) => void
  ) => {
    setSubtasks(subtasks.filter(subtask => subtask.id !== subtaskId));
  };

  // Watcher Dialog Handlers
  const handleWatcherDialogOpen = () => {
    setState(prev => ({ ...prev, watcherDialogOpen: true }));
  };

  const handleWatcherDialogClose = () => {
    setState(prev => ({ ...prev, watcherDialogOpen: false }));
  };

  return {
    state,
    handleStatusMenuClick,
    handleStatusMenuClose,
    handleStatusChange,
    handleSaveComment,
    handleEditStart,
    handleTimeLogSubmit,
    handleTimeLogEdit,
    handleTimeLogDialogClose,
    handleAddSubtaskClick,
    handleSubtaskUpdate,
    handleSubtaskDelete,
    handleWatcherDialogOpen,
    handleWatcherDialogClose
  };
};
