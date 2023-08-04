import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TablePagination, TextField } from '@mui/material';

interface Post {
  id: number;
  title: string;
  body: string;
}

const PostTable: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const history = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalPosts, setTotalPosts] = useState(0);
  const [filter, setFilter] = useState<string>('');

  useEffect(() => {
    fetchPosts(page, rowsPerPage, filter);
  }, [page, rowsPerPage, filter]);

  const fetchPosts = (page: number, perPage: number, searchText: string) => {
    const url = `http://localhost:4000/api/posts/${userId}`;
    axios.get(url, {
      params: {
        page,
        perPage,
        searchText,
      }
    })
      .then(response => {
        setPosts(response.data.posts);
        setTotalPosts(response.data.totalPosts);
      })
      .catch(error => console.error('Error fetching posts:', error));
  };

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDelete = (postId: number) => {
    axios.delete(`http://localhost:4000/api/posts/${userId}/${postId}`)
      .then(() => {
        // setPosts(posts.filter(post => post.id !== postId));
        fetchPosts(page, rowsPerPage, filter);
      })
      .catch(error => console.error('Error deleting post:', error));
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(event.target.value);
    setPage(0);
  };

  return (
    <>
      <Button variant="contained" onClick={() => history(-1)}>Back</Button>
      <TableContainer component={Paper} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: '200px', marginTop: '10px'}}>
          <TextField
            label="Filter"
            value={filter}
            onChange={handleFilterChange}
            variant="outlined"
            size="small"
          />
        </div>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Body</TableCell>
              <TableCell>Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {posts.map(post => (
              <TableRow key={post.id}>
                <TableCell>{post.id}</TableCell>
                <TableCell>{post.title}</TableCell>
                <TableCell>{post.body}</TableCell>
                <TableCell>
                  <Button variant="contained" onClick={() => handleDelete(post.id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10]}
        component="div"
        count={totalPosts}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
};

export default PostTable;
