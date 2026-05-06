import {
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  Link,
} from "@mui/material";
import { useBlogs } from "../../store";
import { useMatch } from "react-router-dom";

const BlogDetails = ({ likeBlog, deleteBlog, user }) => {
  const blogs = useBlogs()
  const match = useMatch("/blogs/:id")
  const blog = match ? blogs.find((blog) => blog.id === match.params.id) : null

  if (!blog) return null;

  const handleLike = async () => {
    const newBlog = {
      ...blog,
      likes: blog.likes + 1,
    };
    likeBlog(blog.id, newBlog);
  };

  return (
    <div className="blog">
      <Card sx={{ mt: 2 }}>
        <CardContent>
          <Typography gutterBottom variant="h5">
            {blog.title}
          </Typography>
          <Typography
            sx={{ color: "text.secondary", mb: 1 }}
            variant="subtitle1"
          >
            by {blog.author}
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href={blog.url}
              underline="hover"
            >
              {blog.url}
            </Link>
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", mb: 1.5 }}>
            Added by {blog.user?.name || "Anonymous"}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="body2">
              <strong>{blog.likes} likes</strong>
            </Typography>

            {user && (
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button onClick={handleLike} variant="outlined" size="small">
                  LIKE
                </Button>
                <Button
                  onClick={() => {
                    deleteBlog(blog.id);
                  }}
                  color="error"
                  variant="outlined"
                  size="small"
                >
                  DELETE
                </Button>
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogDetails;
