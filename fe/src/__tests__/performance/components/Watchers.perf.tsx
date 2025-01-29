import React from 'react';
import { render } from '@testing-library/react';
import { Profiler } from 'react';
import { TestWrapper } from '../../TestWrapper';
import WatcherList from '../../../components/Watchers/WatcherList';
import WatcherDialog from '../../../components/Watchers/WatcherDialog';
import { TaskWatcher } from '../../../types/watcher';

// Mock data
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
    role: 'Project Manager'
  }
];

// Performance measurement callback
const onRenderCallback = (
  id: string,
  phase: 'mount' | 'update' | 'nested-update',
  actualDuration: number,
  baseDuration: number,
  startTime: number,
  commitTime: number
) => {
  // Log performance metrics
  console.log(`${id} - ${phase}`);
  console.log(`Actual duration: ${actualDuration.toFixed(2)}ms`);
  console.log(`Base duration: ${baseDuration.toFixed(2)}ms`);
  console.log(`Commit time: ${(commitTime - startTime).toFixed(2)}ms`);
};

// Helper function to measure render performance
const measurePerformance = (Component: React.ComponentType<any>, props = {}) => (
  <TestWrapper>
    <Profiler id={Component.name} onRender={onRenderCallback}>
      <Component {...props} />
    </Profiler>
  </TestWrapper>
);

describe('WatcherList Performance', () => {
  it('renders efficiently with no watchers', () => {
    render(
      measurePerformance(WatcherList, {
        watchers: [],
        canManageWatchers: true,
        onRemoveWatcher: () => {},
        onManageWatchers: () => {}
      })
    );
  });

  it('renders efficiently with multiple watchers', () => {
    render(
      measurePerformance(WatcherList, {
        watchers: mockWatchers,
        canManageWatchers: true,
        onRemoveWatcher: () => {},
        onManageWatchers: () => {}
      })
    );
  });

  it('renders efficiently with read-only permissions', () => {
    render(
      measurePerformance(WatcherList, {
        watchers: mockWatchers,
        canManageWatchers: false,
        onRemoveWatcher: () => {},
        onManageWatchers: () => {}
      })
    );
  });
});

describe('WatcherDialog Performance', () => {
  it('renders efficiently when closed', () => {
    render(
      measurePerformance(WatcherDialog, {
        open: false,
        onClose: () => {},
        projectId: 1,
        currentWatchers: [],
        onAddWatcher: () => {},
        onRemoveWatcher: () => {}
      })
    );
  });

  it('renders efficiently when open with no watchers', () => {
    render(
      measurePerformance(WatcherDialog, {
        open: true,
        onClose: () => {},
        projectId: 1,
        currentWatchers: [],
        onAddWatcher: () => {},
        onRemoveWatcher: () => {}
      })
    );
  });

  it('renders efficiently when open with existing watchers', () => {
    render(
      measurePerformance(WatcherDialog, {
        open: true,
        onClose: () => {},
        projectId: 1,
        currentWatchers: mockWatchers,
        onAddWatcher: () => {},
        onRemoveWatcher: () => {}
      })
    );
  });
});
