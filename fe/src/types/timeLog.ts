export interface TimeLog {
  id: number;
  task_id: number;
  user_id: number;
  activity_type_id: number;
  log_date: string;
  spent_time: number;
  description: string | null;
  created_on: string;
  updated_on: string | null;
  // Virtual fields
  task_name?: string;
  project_name?: string;
  user_name?: string;
  activity_type_name?: string;
  activity_type_color?: string;
  activity_type_icon?: string;
}

export interface TimeLogCreate {
  task_id: number;
  user_id?: number;
  activity_type_id: number;
  log_date: string;
  spent_time: number;
  description?: string;
}

export interface ActivityType {
  id: number;
  name: string;
  description: string | null;
  color: string;
  icon: string | null;
  active: boolean;
  created_on: string;
  updated_on: string | null;
}

export interface TimeSpent {
  task_id: number;
  spent_time: number;
}

export interface TimeLogFormProps {
  projectId?: number;
  taskId?: number;
  onClose: () => void;
  onSubmit: (timeLog: TimeLogCreate) => Promise<void>;
}

export interface TimeLogDialogProps {
  open: boolean;
  projectId?: number;
  taskId?: number;
  timeLog: TimeLog | null;
  onClose: () => void;
  onSubmit: (timeLog: TimeLogCreate) => Promise<void>;
}

export interface TimeLogDashboardProps {
  taskId: number;
}

export interface TimeLogChartProps {
  timeLogs: TimeLog[];
  activityTypes: ActivityType[];
}

export interface ChartData {
  name: string;
  hours: number;
  color: string;
}

export interface TimeLogCalendarProps {
  projectId: number;
}

export interface ExtendedTimeLogFormProps extends TimeLogFormProps {
  activityTypes: ActivityType[];
}

export interface TimeLogListProps {
  timeLogs: TimeLog[];
  onEdit?: (timeLog: TimeLog) => void;
  onDelete?: (timeLogId: number) => void;
}

export interface TimeLogStatsProps {
  timeLogs: TimeLog[];
}
