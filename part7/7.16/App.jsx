import { useState, useEffect } from "react";
import blogService from "./services/blogs";
import Login from "./components/Login";
import loginService from "./services/login";
import Notification from "./components/Notification";
import "./index.css";
import NewBlog from "./components/NewBlog";
import Toggable from "./components/Toggable";
import BlogList from "./components/BlogList";
import {
  Routes,
  Route,
  NavLink,
  useMatch,
  useNavigate,
} from "react-router-dom";
import BlogDetails from "./components/BlogDetails";
import {
  AppBar,
  Button,
  Toolbar,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import ErrorBoundary from "./components/ErrorBoundary";
import { useNotificationDispatch } from "./NotificationContext";
import { useBlogs } from "./hooks/useBlogs";
import { useUser } from "./UserContext";
import persistentUser from "./services/persistentUser";
import Users from "./components/UsersList";
import UsersList from "./components/UsersList";

const App = () => {
  const { blogs, isPending } = useBlogs();
  const { user, setUser, logout } = useUser()

  const navigate = useNavigate();

  const dispatch = useNotificationDispatch()

  const notify = (message, type = "success") => {
    dispatch({ type: 'SET_NOTIFICATION', payload: { message, type } });
    setTimeout(() => {
      dispatch({ type: 'CLEAR_NOTIFICATION' });
    }, 5000);
  };

  useEffect(() => {
    const loggedUser = persistentUser.getUser()
    if (loggedUser) {
      setUser(loggedUser);
    }
  }, []);

  const style = { "&:hover": { bgcolor: "rgba(255,255,255,0.3)" } };

  return (
    <div>
      <AppBar position="static">
        <Toolbar disableGutters>
          <Typography sx={{ ml: 4, flexGrow: 1 }} variant="h6" component="div">
            Blog App
          </Typography>
          <Button
            color="inherit"
            component={NavLink}
            to="/"
            sx={style}
            style={({ isActive }) => ({
              borderBottom: isActive ? "2px solid white" : "none",
              fontWeight: isActive ? "bold" : "normal",
            })}
          >
            BLOGS
          </Button>
          <Button
            color="inherit"
            component={NavLink}
            to="/users"
            sx={style}
            style={({ isActive }) => ({
              borderBottom: isActive ? "2px solid white" : "none",
              fontWeight: isActive ? "bold" : "normal",
            })}
          >
            USERS
          </Button>
          {!user ? (
            <Button
              color="inherit"
              component={NavLink}
              to="/login"
              style={({ isActive }) => ({
                borderBottom: isActive ? "2px solid white" : "none",
                fontWeight: isActive ? "bold" : "normal",
              })}
              sx={{ mr: 4, ...style }}
            >
              LOGIN
            </Button>
          ) : (
            <>
              <Button
                color="inherit"
                component={NavLink}
                to="/newBlog"
                sx={style}
                style={({ isActive }) => ({
                  borderBottom: isActive ? "2px solid white" : "none",
                  fontWeight: isActive ? "bold" : "normal",
                })}
              >
                NEW BLOG
              </Button>
              <Button
                onClick={() => {
                  logout()
                  navigate('/')
                }}
                color="inherit"
                sx={{ mr: 4, ...style }}
              >
                LOGOUT
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Notification />

      {isPending ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mt: 10,
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ErrorBoundary>
                <BlogList />
              </ErrorBoundary>
            }
          />
          <Route
            path="/blogs/:id"
            element={
              <BlogDetails />
            }
          />
          <Route
            path="/users"
            element={
              <UsersList />
            }
          />
          <Route
            path="/newBlog"
            element={<NewBlog />}
          />
          <Route path="*" element={<h1>404 - Page Not Found</h1>} />
        </Routes>
      )}

      {/* <Toggable ref={blogFormRef}>
          </Toggable> */}
    </div>
  );
};

export default App;
