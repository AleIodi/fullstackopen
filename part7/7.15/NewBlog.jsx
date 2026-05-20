import { Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useBlogs } from "../hooks/useBlogs";
import useField from "../hooks/useField";

const NewBlog = () => {
  const { reset: resetTitle, ...title } = useField("text")
  const { reset: resetAuthor, ...author } = useField("text")
  const { reset: resetUrl, ...url } = useField("text")
  const navigate = useNavigate();

  const { addBlog } = useBlogs()

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await addBlog({ title: title.value, author: author.value, url: url.value });
      resetTitle()
      resetAuthor()
      resetUrl()
      navigate("/");
    } catch (error) {
      console.error(error)
    }
  };

  return (
    <div>
      <h2>Create New</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <TextField
            sx={{ width: 500 }}
            required
            label="title"
            variant="outlined"
            size="small"
            margin="dense"
            name="Title"
            {...title}
          />
        </div>
        <div>
          <TextField
            sx={{ width: 500 }}
            required
            label="author"
            variant="outlined"
            size="small"
            margin="dense"
            name="Author"
            {...author}
          />
        </div>
        <div>
          <TextField
            sx={{ width: 500 }}
            required
            label="url"
            variant="outlined"
            size="small"
            margin="dense"
            name="Url"
            {...url}
          />
        </div>
        <Button sx={{ marginTop: "1em" }} variant="contained" type="submit">
          CREATE
        </Button>
      </form>
    </div>
  );
};

export default NewBlog;
