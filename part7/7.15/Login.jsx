import { Button, TextField } from "@mui/material";
import { useLogin } from "../hooks/useLogin";
import { useNavigate } from "react-router-dom";
import useField from "../hooks/useField";

const Login = ({ onSubmit }) => {
  const { reset: resetUsername, ...username } = useField("text")
  const { reset: resetPassword, ...password } = useField("password")

  const { login, isPending } = useLogin()

  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await login({ username: username.value, password: password.value });
      resetUsername()
      resetPassword()
      navigate('/')
    } catch (error) {
      console.log(error)
      console.error("Login failed, staying on page");
    }
  };

  return (
    <div>
      <h2>Login to application</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <TextField
            required
            label="username"
            variant="standard"
            slotProps={{
              input: {
                readOnly: isPending,
              },
            }}
            {...username}
            name="Username"
          />
        </div>
        <div>
          <TextField
            required
            label="password"
            autoComplete="current-password"
            variant="standard"
            slotProps={{
              input: {
                readOnly: isPending,
              },
            }}
            {...password}
            name="Password"
          />
        </div>
        <Button sx={{ mt: 2 }} variant="contained" type="submit" disabled={isPending}>
          LOGIN
        </Button>
      </form>
    </div>
  );
};

export default Login;
