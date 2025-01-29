import { renderHook, act } from '@testing-library/react-hooks';
import { useTaskWatchers } from '../useTaskWatchers';
import { getTaskWatchers, addTaskWatcher, removeTaskWatcher } from '../../../api/watchers';
import { TaskWatcher } from '../../../types/watcher';

// Mock API calls
jest.mock('../../../api/watchers');

describe('useTaskWatchers', () => {
  const mockWatchers: TaskWatcher[] = [
    {
      task_id: 1,
      user_id: 1,
      user_name: 'Test User 1',
      role: 'Developer'
    },
    {
      task_id: 1,
      user_id: 2,
      user_name: 'Test User 2',
      role: 'Manager'
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (getTaskWatchers as jest.Mock).mockResolvedValue(mockWatchers);
  });

  it('should load watchers successfully', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useTaskWatchers('1'));

    await waitForNextUpdate();

    expect(getTaskWatchers).toHaveBeenCalledWith(1);
    expect(result.current.watchers).toEqual(mockWatchers);
  });

  it('should add watcher successfully', async () => {
    const newWatcher: TaskWatcher = {
      task_id: 1,
      user_id: 3,
      user_name: 'Test User 3',
      role: 'Developer'
    };

    (addTaskWatcher as jest.Mock).mockResolvedValue(undefined);
    (getTaskWatchers as jest.Mock).mockResolvedValue([...mockWatchers, newWatcher]);

    const { result, waitForNextUpdate } = renderHook(() => useTaskWatchers('1'));
    await waitForNextUpdate();

    await act(async () => {
      await result.current.handleAddWatcher(3);
    });

    expect(addTaskWatcher).toHaveBeenCalledWith(1, 3);
    expect(result.current.watchers).toEqual([...mockWatchers, newWatcher]);
  });

  it('should remove watcher successfully', async () => {
    (removeTaskWatcher as jest.Mock).mockResolvedValue(undefined);
    (getTaskWatchers as jest.Mock).mockResolvedValue([mockWatchers[1]]);

    const { result, waitForNextUpdate } = renderHook(() => useTaskWatchers('1'));
    await waitForNextUpdate();

    await act(async () => {
      await result.current.handleRemoveWatcher(1);
    });

    expect(removeTaskWatcher).toHaveBeenCalledWith(1, 1);
    expect(result.current.watchers).toEqual([mockWatchers[1]]);
  });

  it('should handle add watcher error', async () => {
    const error = new Error('Failed to add watcher');
    (addTaskWatcher as jest.Mock).mockRejectedValue(error);

    const { result, waitForNextUpdate } = renderHook(() => useTaskWatchers('1'));
    await waitForNextUpdate();

    await expect(result.current.handleAddWatcher(3)).rejects.toThrow('Failed to add watcher');
  });

  it('should handle remove watcher error', async () => {
    const error = new Error('Failed to remove watcher');
    (removeTaskWatcher as jest.Mock).mockRejectedValue(error);

    const { result, waitForNextUpdate } = renderHook(() => useTaskWatchers('1'));
    await waitForNextUpdate();

    await expect(result.current.handleRemoveWatcher(1)).rejects.toThrow('Failed to remove watcher');
  });

  it('should refresh watchers when called', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useTaskWatchers('1'));
    await waitForNextUpdate();

    // Clear initial call count
    (getTaskWatchers as jest.Mock).mockClear();

    await act(async () => {
      await result.current.fetchWatchers();
    });

    expect(getTaskWatchers).toHaveBeenCalledWith(1);
  });
});
