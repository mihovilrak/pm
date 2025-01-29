import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskTypeDialog from '../TaskTypeDialog';
import { TaskType } from '../../../types/setting';

const mockTaskType: TaskType = {
  id: 1,
  name: 'Test Task',
  color: '#2196f3',
  description: 'Test Description',
  icon: 'TestIcon',
  active: true
};

const mockProps = {
  open: true,
  onClose: jest.fn(),
  onSave: jest.fn(),
};

describe('TaskTypeDialog', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders create mode correctly', () => {
      render(<TaskTypeDialog {...mockProps} />);
      
      expect(screen.getByText('Create Task Type')).toBeInTheDocument();
      expect(screen.getByLabelText('Name')).toHaveValue('');
      expect(screen.getByLabelText('Color')).toHaveValue('#2196f3');
      expect(screen.getByLabelText('Description')).toHaveValue('');
    });

    it('renders edit mode correctly', () => {
      render(<TaskTypeDialog {...mockProps} taskType={mockTaskType} />);
      
      expect(screen.getByText('Edit Task Type')).toBeInTheDocument();
      expect(screen.getByLabelText('Name')).toHaveValue('Test Task');
      expect(screen.getByLabelText('Color')).toHaveValue('#2196f3');
      expect(screen.getByLabelText('Description')).toHaveValue('Test Description');
    });
  });

  describe('Form Interactions', () => {
    it('handles input changes correctly', async () => {
      render(<TaskTypeDialog {...mockProps} />);
      
      const nameInput = screen.getByLabelText('Name');
      const descInput = screen.getByLabelText('Description');
      
      await userEvent.type(nameInput, 'New Task');
      await userEvent.type(descInput, 'New Description');
      
      expect(nameInput).toHaveValue('New Task');
      expect(descInput).toHaveValue('New Description');
    });

    it('handles active switch toggle', () => {
      render(<TaskTypeDialog {...mockProps} />);
      
      const activeSwitch = screen.getByRole('checkbox');
      fireEvent.click(activeSwitch);
      
      expect(activeSwitch).not.toBeChecked();
    });

    it('submits form with correct data', async () => {
      render(<TaskTypeDialog {...mockProps} />);
      
      await userEvent.type(screen.getByLabelText('Name'), 'New Task');
      await userEvent.type(screen.getByLabelText('Description'), 'New Description');
      
      const submitButton = screen.getByText('Create');
      fireEvent.click(submitButton);
      
      expect(mockProps.onSave).toHaveBeenCalledWith({
        name: 'New Task',
        color: '#2196f3',
        description: 'New Description',
        active: true
      });
    });
  });

  describe('Error Handling', () => {
    it('displays error message when save fails', async () => {
      const error = new Error('Failed to save');
      const mockSaveWithError = jest.fn().mockRejectedValue(error);
      
      render(<TaskTypeDialog {...mockProps} onSave={mockSaveWithError} />);
      
      const submitButton = screen.getByText('Create');
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Failed to save task type')).toBeInTheDocument();
      });
    });

    it('clears error on new submission', async () => {
      const error = new Error('Failed to save');
      const mockSaveWithError = jest.fn()
        .mockRejectedValueOnce(error)
        .mockResolvedValueOnce(undefined);
      
      render(<TaskTypeDialog {...mockProps} onSave={mockSaveWithError} />);
      
      const submitButton = screen.getByText('Create');
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Failed to save task type')).toBeInTheDocument();
      });
      
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.queryByText('Failed to save task type')).not.toBeInTheDocument();
      });
    });
  });

  describe('Dialog Actions', () => {
    it('calls onClose when cancel button is clicked', () => {
      render(<TaskTypeDialog {...mockProps} />);
      
      const cancelButton = screen.getByText('Cancel');
      fireEvent.click(cancelButton);
      
      expect(mockProps.onClose).toHaveBeenCalled();
    });

    it('calls onClose after successful save', async () => {
      render(<TaskTypeDialog {...mockProps} />);
      
      const submitButton = screen.getByText('Create');
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(mockProps.onClose).toHaveBeenCalled();
      });
    });
  });
});