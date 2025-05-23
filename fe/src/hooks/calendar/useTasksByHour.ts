import { Task } from '../../types/task';
import { TimeLog } from '../../types/timeLog';

export const useTasksByHour = (tasks: Task[], timeLogs: TimeLog[]) => {
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getTasksForHour = (hour: number): Task[] => {
    return tasks.filter(task => {
      if (!task.start_date) return false;
      const taskDate = new Date(task.start_date);
      return taskDate.getUTCHours() === hour;
    });
  };

  const getTimeLogsForHour = (hour: number): TimeLog[] => {
    return timeLogs.filter(timeLog => {
      const logDate = new Date(timeLog.created_on);
      return logDate.getUTCHours() === hour;
    });
  };

  return {
    hours,
    getTasksForHour,
    getTimeLogsForHour
  };
};
