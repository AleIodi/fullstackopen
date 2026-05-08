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
import ProtectedRoute from "./components/ProtectedRoute"
import {
  useBlogActions,
  useBlogIsLoading,
  useBlogs,
  useNotify,
  useUser,
  useUserActions,
} from "../store";

const App = () => {
  const user = useUser();
  const { inizialize: inizializeLogin, logout } = useUserActions()

  const isLoading = useBlogIsLoading();
  const { inizialize: inizializeBlogs } = useBlogActions();

  const navigate = useNavigate();

  const notify = useNotify();

  useEffect(() => {
    inizializeBlogs();
  }, []);

  useEffect(() => {
    inizializeLogin()
  }, []);

  const handleLogout = () => {
    logout()
    navigate("/");
  };

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
                onClick={handleLogout}
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

      {isLoading ? (
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
          <Route path="/blogs/:id" element={<BlogDetails />} />
          <Route path="/newBlog" element={
            <ProtectedRoute >
              <NewBlog />
            </ProtectedRoute>
          } />
          <Route path="*" element={<h1>404 - Page Not Found</h1>} />
        </Routes>
      )}

      {/* <Toggable ref={blogFormRef}>
          </Toggable> */}
    </div>
  );
};

export default App;
