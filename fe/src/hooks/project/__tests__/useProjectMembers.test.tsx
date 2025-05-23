import { renderHook, act } from '@testing-library/react';
import { useProjectMembers } from '../useProjectMembers';
import {
  getProjectMembers,
  addProjectMember,
  removeProjectMember,
  updateProjectMember
} from '../../../api/projects';
import { ProjectMember } from '../../../types/project';

// Mock dependencies
jest.mock('../../../api/projects');

describe('useProjectMembers', () => {
  const mockMembers: ProjectMember[] = [
    {
      project_id: 1,
      user_id: 1,
      created_on: '2024-01-01',
      name: 'John',
      surname: 'Doe',
      role: 'Developer'
    },
    {
      project_id: 1,
      user_id: 2,
      created_on: '2024-01-01',
      name: 'Jane',
      surname: 'Smith',
      role: 'Project Manager'
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ...

  it('should handle members update with new users', async () => {
    (getProjectMembers as jest.Mock).mockReset(); // Ensure reset BEFORE any other calls
    const newMember = {
      project_id: 1,
      user_id: 3,
      role_id: 1,
      created_on: '2024-01-01',
      name: 'Bob',
      surname: 'Johnson',
      role: 'Developer'
    };
    (addProjectMember as jest.Mock).mockResolvedValue(newMember);
    (getProjectMembers as jest.Mock)
      .mockResolvedValueOnce(mockMembers) // initial load
      .mockResolvedValueOnce([...mockMembers, newMember]); // after add

    const { result } = renderHook(() => useProjectMembers('1'));

    await act(async () => {
      await result.current.loadMembers();
    });

    await act(async () => {
      await result.current.handleMembersUpdate([1, 2, 3]);
    });

    expect(addProjectMember).toHaveBeenCalledWith(1, 3);
    expect(result.current.members).toContainEqual(newMember);
  });

  it('should fetch project members on mount', async () => {
    (getProjectMembers as jest.Mock).mockResolvedValue(mockMembers);
    const { result } = renderHook(() => useProjectMembers('1'));

    await act(async () => {
      await result.current.loadMembers();
    });

    expect(getProjectMembers).toHaveBeenCalledWith(1);
    expect(result.current.members).toEqual(mockMembers);
  });

  it('should handle member update', async () => {
    (getProjectMembers as jest.Mock).mockResolvedValue(mockMembers);
    const updatedMember = {
      ...mockMembers[0],
      role: 'Senior Developer'
    };
    (updateProjectMember as jest.Mock).mockResolvedValue(updatedMember);

    const { result } = renderHook(() => useProjectMembers('1'));

    await act(async () => {
      await result.current.loadMembers();
    });

    await act(async () => {
      await result.current.handleMemberUpdate(1, 'Senior Developer');
    });

    expect(updateProjectMember).toHaveBeenCalledWith(1, 1, 'Senior Developer');
    expect(result.current.members[0].role).toBe('Senior Developer');
  });

  it('should handle member removal', async () => {
    (getProjectMembers as jest.Mock).mockResolvedValue(mockMembers);
    (removeProjectMember as jest.Mock).mockResolvedValue(undefined);

    const { result } = renderHook(() => useProjectMembers('1'));

    await act(async () => {
      await result.current.loadMembers();
    });

    await act(async () => {
      await result.current.handleMemberRemove(1);
    });

    expect(removeProjectMember).toHaveBeenCalledWith(1, 1);
    expect(result.current.members).toEqual([mockMembers[1]]);
  });

  it('should handle members update with new users', async () => {
    const newMember = {
      project_id: 1,
      user_id: 3,
      role_id: 1,
      created_on: '2024-01-01',
      name: 'Bob',
      surname: 'Johnson',
      role: 'Developer'
    };
    (addProjectMember as jest.Mock).mockResolvedValue(newMember);
    // Make getProjectMembers return the updated list after add
    (getProjectMembers as jest.Mock)
      .mockResolvedValueOnce(mockMembers) // initial load
      .mockResolvedValueOnce([...mockMembers, newMember]); // after add

    const { result } = renderHook(() => useProjectMembers('1'));

    await act(async () => {
      await result.current.loadMembers();
    });

    await act(async () => {
      await result.current.handleMembersUpdate([1, 2, 3]);
    });

    expect(addProjectMember).toHaveBeenCalledWith(1, 3);
    expect(result.current.members).toContainEqual(newMember);
  });

  it('should handle error during member operations', async () => {
    (getProjectMembers as jest.Mock).mockResolvedValue(mockMembers);
    const error = new Error('Failed to update member');
    (updateProjectMember as jest.Mock).mockRejectedValue(error);

    const { result } = renderHook(() => useProjectMembers('1'));

    await act(async () => {
      await result.current.loadMembers();
    });

    await expect(result.current.handleMemberUpdate(1, 'Senior Developer')).rejects.toThrow('Failed to update member');
  });

  it('should toggle manage members dialog', () => {
    (getProjectMembers as jest.Mock).mockResolvedValue(mockMembers);
    const { result } = renderHook(() => useProjectMembers('1'));

    act(() => {
      result.current.setManageMembersOpen(true);
    });
    expect(result.current.manageMembersOpen).toBe(true);

    act(() => {
      result.current.setManageMembersOpen(false);
    });
    expect(result.current.manageMembersOpen).toBe(false);
  });
});
