import React, { ReactNode } from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AuthProvider, { useAuth } from '../AuthContext';
import { api } from '../../api/api';

jest.mock('../../api/api', () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

const TestComponent = ({ children }: { children: (auth: any) => ReactNode }) => {
  const auth = useAuth();
  return <div data-testid="test-component">{children(auth)}</div>;
};

describe('AuthContext', () => {
  const mockPermissions = [
    { permission: 'Admin' },
    { permission: 'Create projects' },
    { permission: 'Edit projects' },
    { permission: 'Delete projects' },
    { permission: 'Create tasks' },
    { permission: 'Edit tasks' },
    { permission: 'Delete tasks' },
    { permission: 'Log time' },
    { permission: 'Edit log' },
    { permission: 'Delete log' },
    { permission: 'Delete files' }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with null user and empty permissions', async () => {
    (api.get as jest.Mock).mockRejectedValueOnce(new Error('No session'));

    render(
      <AuthProvider>
        <TestComponent>
          {(auth) => (
            <>
              <div data-testid="user">{JSON.stringify(auth.currentUser)}</div>
              <div data-testid="permissions">{JSON.stringify(auth.userPermissions)}</div>
            </>
          )}
        </TestComponent>
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('user').textContent).toBe('null');
      expect(screen.getByTestId('permissions').textContent).toBe('[]');
    });
  });

  it('should handle successful login with admin permissions', async () => {
    const mockUser = { id: 1, name: 'Admin User' };
    
    (api.post as jest.Mock).mockResolvedValueOnce({ data: { user: mockUser }});
    (api.get as jest.Mock).mockResolvedValueOnce({ data: mockPermissions });

    render(
      <AuthProvider>
        <TestComponent>
          {(auth) => (
            <div data-testid="auth-state">
              <button onClick={() => auth.login('admin', 'password')}>Login</button>
              <div data-testid="admin-permission">
                {auth.hasPermission('Admin').toString()}
              </div>
            </div>
          )}
        </TestComponent>
      </AuthProvider>
    );

    await act(async () => {
      await userEvent.click(screen.getByText('Login'));
    });

    await waitFor(() => {
      expect(screen.getByTestId('admin-permission').textContent).toBe('true');
    });
  });

  it('should verify all defined permissions', async () => {
    const mockUser = { id: 1, name: 'Test User' };
    
    (api.get as jest.Mock).mockResolvedValueOnce({ data: { user: mockUser }});
    (api.get as jest.Mock).mockResolvedValueOnce({ data: mockPermissions });

    render(
      <AuthProvider>
        <TestComponent>
          {(auth) => (
            <div>
              {mockPermissions.map(({ permission }) => (
                <div key={permission} data-testid={`permission-${permission}`}>
                  {auth.hasPermission(permission).toString()}
                </div>
              ))}
            </div>
          )}
        </TestComponent>
      </AuthProvider>
    );

    await waitFor(() => {
      mockPermissions.forEach(({ permission }) => {
        expect(screen.getByTestId(`permission-${permission}`).textContent)
          .toBe('true');
      });
    });
  });

  it('should handle logout', async () => {
    (api.post as jest.Mock).mockResolvedValueOnce({});

    render(
      <AuthProvider>
        <TestComponent>
          {(auth) => (
            <button onClick={() => auth.logout()}>Logout</button>
          )}
        </TestComponent>
      </AuthProvider>
    );

    await act(async () => {
      await userEvent.click(screen.getByText('Logout'));
    });

    expect(api.post).toHaveBeenCalledWith('/logout', {});
  });

  it('should handle login errors', async () => {
    (api.post as jest.Mock).mockRejectedValueOnce(new Error('Invalid credentials'));

    render(
      <AuthProvider>
        <TestComponent>
          {(auth) => (
            <>
              <button onClick={() => auth.login('bad', 'credentials')}>Login</button>
              <div data-testid="error">{auth.error || ''}</div>
            </>
          )}
        </TestComponent>
      </AuthProvider>
    );

    await act(async () => {
      await userEvent.click(screen.getByText('Login'));
    });

    expect(screen.getByTestId('error').textContent)
      .toBe('Login failed. Please check your credentials.');
  });
});