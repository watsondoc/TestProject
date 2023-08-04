import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Typography, Tooltip
} from '@mui/material';

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: string;
}

const UserTable: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(4);
  const [totalUsers, setTotalUsers] = useState(0);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [sortColumn, setSortColumn] = useState<string>('username');

  useEffect(() => {
    fetchUsers(page, rowsPerPage, sortColumn, sortDirection);
  }, [page, rowsPerPage, sortColumn, sortDirection]);

  const fetchUsers = (page: number, perPage: number, sortBy: string, sortDir: 'asc' | 'desc') => {
    axios.get(`http://localhost:4000/api/users`, {
      params: {
        page,
        perPage,
        sortBy,
        sortDir
      }
    })
      .then(response => {
        const users = response.data.users;
        setUsers(users.map((user: any) => {
          return {
            ...user,
            address: `${user.address?.street} ${user.address?.suit} ${user.address?.city} ${user.address?.zipcode}`
          }
        }));
        setTotalUsers(response.data.totalUsers);
      })
      .catch(error => console.error('Error fetching users:', error));
  };

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSort = (column: string) => {
    const newSortDirection = sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortDirection(newSortDirection);
    setSortColumn(column);
  };

  return (
    <>
      <Typography variant="h4" align="center" gutterBottom>
        Users
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell
                onClick={() => handleSort('username')}
                style={{ cursor: 'pointer', fontWeight: 'bold' }}
              >
                Username {sortColumn === 'username' && (sortDirection === 'asc' ? '↑' : '↓')}
              </TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map(user => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell style={{
                  maxWidth: '50px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap' }
                }>
                  <Tooltip title={user.address}>
                    <span>{user.address}</span>
                  </Tooltip>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Link to={`/posts/${user.id}`}>View Posts</Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[4, 10]}
        component="div"
        count={totalUsers}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
};

export default UserTable;
