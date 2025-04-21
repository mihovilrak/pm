import { renderHook, act, waitFor } from '@testing-library/react';
import {
  useTaskFileWrapper,
  useTimeLogCalendarWrapper,
  useTaskTimeLogsWrapper,
  useAppState,
} from '../useAppRoutes';
import { getTaskById } from '../../../api/tasks';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Task } from '../../../types/task';
import { TaskFile } from '../../../types/file';

// Mock the tasks API
jest.mock('../../../api/tasks');
const mockedGetTaskById = getTaskById as jest.MockedFunction<typeof getTaskById>;


// Mock window.location
const mockLocation = {
  pathname: '/tasks/1',
};
Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true,
});

describe('useTaskFileWrapper', () => {
  it('should return correct taskId and handlers', () => {
    const { result } = renderHook(() => useTaskFileWrapper());

    expect(result.current.taskId).toBe(1);
    expect(typeof result.current.handleFileUploaded).toBe('function');
    expect(typeof result.current.handleFileDeleted).toBe('function');
  });

  it('should handle file upload correctly', () => {
    const consoleSpy = jest.spyOn(console, 'log');
    const { result } = renderHook(() => useTaskFileWrapper());

    act(() => {
      result.current.handleFileUploaded({
        id: 1,
        task_id: 1,
        user_id: 1,
        name: 'test.txt',
        original_name: 'test.txt',
        mime_type: 'text/plain',
        size: 1000
      } as TaskFile);
    });

    expect(consoleSpy).toHaveBeenCalledWith('File uploaded:', {
      id: 1,
      task_id: 1,
      user_id: 1,
      name: 'test.txt',
      original_name: 'test.txt',
      mime_type: 'text/plain',
      size: 1000,
    });
  });

  it('should handle file deletion correctly', () => {
    const consoleSpy = jest.spyOn(console, 'log');
    const { result } = renderHook(() => useTaskFileWrapper());

    act(() => {
      result.current.handleFileDeleted(1);
    });

    expect(consoleSpy).toHaveBeenCalledWith('File deleted:', 1);
  });
});

describe('useTimeLogCalendarWrapper', () => {
  it('should return correct projectId from URL', () => {
    mockLocation.pathname = '/projects/2';
    const { result } = renderHook(() => useTimeLogCalendarWrapper());

    expect(result.current.projectId).toBe(2);
  });
});

describe('useTaskTimeLogsWrapper', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <MemoryRouter initialEntries={['/tasks/1']}>
      <Routes>
        <Route path="/tasks/:id" element={children} />
      </Routes>
    </MemoryRouter>
  );

  beforeEach(() => {
    mockedGetTaskById.mockClear();
  });

  it('should fetch task data on mount', async () => {
    const mockTask: Task = {
      id: 1,
      name: 'Test Task',
      project_id: 1,
      project_name: 'Test Project',
      holder_id: 1,
      holder_name: 'Test Holder',
      assignee_id: 1,
      assignee_name: 'Test Assignee',
      parent_id: null,
      parent_name: null,
      description: 'Test Description',
      type_id: 1,
      type_name: 'Test Type',
      status_id: 1,
      status_name: 'Test Status',
      priority_id: 1,
      priority_name: 'Test Priority',
      start_date: null,
      due_date: null,
      end_date: null,
      spent_time: 0,
      progress: 0,
      created_on: new Date().toISOString(),
      created_by: 1,
      created_by_name: 'Test Creator',
      estimated_time: null
    };
    mockedGetTaskById.mockResolvedValueOnce(mockTask);

    const { result } = renderHook(() => useTaskTimeLogsWrapper(), { wrapper });

    expect(result.current.task).toBeNull();

    await waitFor(() => {
      expect(mockedGetTaskById).toHaveBeenCalledWith(1);
      expect(result.current.task).toEqual(mockTask);
    });
  });

  it('should handle fetch error gracefully', async () => {
    const consoleSpy = jest.spyOn(console, 'error');
    mockedGetTaskById.mockRejectedValueOnce(new Error('Failed to fetch'));

    const { result } = renderHook(() => useTaskTimeLogsWrapper(), { wrapper });

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Failed to fetch task:', expect.any(Error));
      expect(result.current.task).toBeNull();
    });
  });
});

describe('useAppState', () => {
  it('should initialize with taskFormOpen as false', () => {
    const { result } = renderHook(() => useAppState());

    expect(result.current.taskFormOpen).toBe(false);
  });

  it('should handle task creation correctly', async () => {
    const { result } = renderHook(() => useAppState());

    act(() => {
      result.current.setTaskFormOpen(true);
    });
    expect(result.current.taskFormOpen).toBe(true);

    await act(async () => {
      await result.current.handleTaskCreated({
        id: 1,
        name: 'New Task',
        project_id: 1,
        project_name: 'Test Project',
        holder_id: 1,
        holder_name: 'Test Holder',
        assignee_id: 1,
        assignee_name: 'Test Assignee',
        parent_id: null,
        parent_name: null,
        description: 'Test Description',
        type_id: 1,
        type_name: 'Test Type',
        status_id: 1,
        status_name: 'Test Status',
        priority_id: 1,
        priority_name: 'Test Priority',
        start_date: null,
        due_date: null,
        end_date: null,
        spent_time: 0,
        progress: 0,
        created_by: 1,
        created_by_name: 'Test Creator',
        created_on: new Date().toISOString(),
        estimated_time: null
      });
    });
    expect(result.current.taskFormOpen).toBe(false);
  });

  it('should handle form close correctly', () => {
    const { result } = renderHook(() => useAppState());

    act(() => {
      result.current.setTaskFormOpen(true);
    });
    expect(result.current.taskFormOpen).toBe(true);

    act(() => {
      result.current.handleTaskFormClose();
    });
    expect(result.current.taskFormOpen).toBe(false);
  });
});