import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RolesTable from '../RolesTable';
import { Role } from '../../../types/role';

const mockRoles: Role[] = [
  {
    id: 1,
    name: 'Admin',
    description: 'Administrator role',
    active: true,
    permissions: [
      { id: 1, name: 'Create Users' },
      { id: 2, name: 'Edit Users' }
    ]
  },
  {
    id: 2,
    name: 'User',
    description: 'Basic user role',
    active: false,
    permissions: [{ id: 1, name: 'Create Users' }]
  }
];

describe('RolesTable', () => {
  const defaultProps = {
    roles: mockRoles,
    onEdit: jest.fn(),
    loading: false
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('displays loading spinner when loading prop is true', () => {
    render(<RolesTable {...defaultProps} loading={true} />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders table headers correctly', () => {
    render(<RolesTable {...defaultProps} />);
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Permissions')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });

  it('renders role data correctly', () => {
    render(<RolesTable {...defaultProps} />);
    expect(screen.getByText('Admin')).toBeInTheDocument();
    expect(screen.getByText('Administrator role')).toBeInTheDocument();
    expect(screen.getByText('2 permissions')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', async () => {
    render(<RolesTable {...defaultProps} />);
    const editButtons = screen.getAllByRole('button');
    await userEvent.click(editButtons[0]);
    expect(defaultProps.onEdit).toHaveBeenCalledWith(mockRoles[0]);
  });

  it('shows correct permission count in chip', () => {
    render(<RolesTable {...defaultProps} />);
    const permissionChips = screen.getAllByText(/permissions$/);
    expect(permissionChips[0]).toHaveTextContent('2 permissions');
    expect(permissionChips[1]).toHaveTextContent('1 permissions');
  });

  it('displays correct status chips', () => {
    render(<RolesTable {...defaultProps} />);
    const activeChip = screen.getByText('Active');
    const inactiveChip = screen.getByText('Inactive');
    expect(activeChip).toHaveClass('MuiChip-colorSuccess');
    expect(inactiveChip).toHaveClass('MuiChip-colorError');
  });

  it('handles empty roles array', () => {
    render(<RolesTable {...defaultProps} roles={[]} />);
    expect(screen.queryByRole('row')).toBeTruthy();
    expect(screen.getAllByRole('row')).toHaveLength(1); // Only header row
  });
});