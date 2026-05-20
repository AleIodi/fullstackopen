import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Box
} from '@mui/material'
import { useUsers } from '../hooks/useUsers'

const UsersList = () => {
  const { users, isPending } = useUsers()

  if (isPending) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <div>
      <h2>Users</h2>
      <TableContainer component={Paper} elevation={0}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Username</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Blogs created</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users
              .filter((user) => user.blogs && user.blogs.length > 0)
              .map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.blogs.length}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default UsersList
