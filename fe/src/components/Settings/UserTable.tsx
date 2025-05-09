import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Tooltip,
  Chip
} from '@mui/material';
import { 
  Edit as EditIcon,
  Delete as DeleteIcon 
} from '@mui/icons-material';
import { User } from '../../types/user';
import { deleteUser } from '../../api/users';
import { UserTableProps } from '../../types/setting';

const UserTable: React.FC<UserTableProps> = ({ users, onEditUser, onUserDeleted }) => {
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const handleChangePage = (_event: unknown, newPage: number): void => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDeleteClick = (user: User): void => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async (): Promise<void> => {
    try {
      if (userToDelete) {
        await deleteUser(userToDelete.id);
        onUserDeleted();
      }
    } catch (error) {
      console.error('Failed to delete user:', error);
    } finally {
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table data-testid="user-table">
          <TableHead>
            <TableRow>
              <TableCell>Login</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.login}</TableCell>
                  <TableCell>{`${user.name} ${user.surname}`}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip 
                      label={user.role_name || 'No Role'} 
                      size="small"
                      color={user.role_name === 'Admin' ? 'primary' : 'default'}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit">
                      <IconButton 
                        data-testid={`edit-user-${user.id}`}
                        onClick={() => onEditUser(user)}
                        aria-label="Edit"
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton 
                        data-testid={`delete-user-${user.id}`}
                        onClick={() => handleDeleteClick(user)}
                        aria-label="Delete"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={users.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        data-testid="pagination"
      />

      <Dialog 
        open={deleteDialogOpen} 
        onClose={() => setDeleteDialogOpen(false)}
        data-testid="delete-dialog"
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography data-testid="delete-confirmation-text">
            Are you sure you want to delete user {userToDelete?.name}? 
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDeleteDialogOpen(false)}
            data-testid="cancel-delete-button"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error"
            data-testid="confirm-delete-button"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserTable;
