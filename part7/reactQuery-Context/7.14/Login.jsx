import { Button, TextField } from "@mui/material";
import { useState } from "react";
import { useLogin } from "../hooks/useLogin";
import { useNavigate } from "react-router-dom";

const Login = ({ onSubmit }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { login, isPending } = useLogin()

  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await login({ username, password });
      setUsername("");
      setPassword("");
      navigate('/')
    } catch (error) {
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
            value={username}
            onChange={({ target }) => setUsername(target.value)}
            name="Username"
          />
        </div>
        <div>
          <TextField
            required
            label="password"
            type="password"
            autoComplete="current-password"
            variant="standard"
            slotProps={{
              input: {
                readOnly: isPending,
              },
            }}
            value={password}
            onChange={({ target }) => setPassword(target.value)}
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
