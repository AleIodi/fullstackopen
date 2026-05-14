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

const App = () => {
  const {blogs, isPending} = useBlogs();
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  const dispatch = useNotificationDispatch()

  const notify = (message, type = "success") => {
   dispatch({ type: 'SET_NOTIFICATION', payload: { message, type } });
    setTimeout(() => {
      dispatch({ type: 'CLEAR_NOTIFICATION' });
    }, 5000);
  };

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBloglistUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (userToLogin) => {
    try {
      const user = await loginService.login(userToLogin);
      blogService.setToken(user.token);
      window.localStorage.setItem("loggedBloglistUser", JSON.stringify(user));

      setUser(user);

      notify("login successful");
      navigate("/");
    } catch (exception) {
      const serverErrorMessage =
        exception.response &&
        exception.response.data &&
        exception.response.data.error
          ? exception.response.data.error
          : "Wrong credentials";

      notify(serverErrorMessage, "error");
      navigate("/login");
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem("loggedBloglistUser");
    setUser(null);
    blogService.setToken(null);
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
          <Route path="/login" element={<Login onSubmit={handleLogin} />} />
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
              <BlogDetails
                user={user}
              />
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
