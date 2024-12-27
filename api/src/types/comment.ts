import { Request } from 'express';

export interface Comment {
  id: string;
  task_id: string;
  user_id: string;
  comment: string;
  created_on: Date;
  updated_on: Date;
  active: boolean;
}

export interface CommentCreateInput {
  comment: string;
}

export interface CommentUpdateInput {
  comment: string;
}

export interface CommentWithUser extends Comment {
  user_name: string;
  user_surname: string;
  user_email: string;
  user_login: string;
}

export interface TaskRequest extends Request {
  taskId?: string;
}
