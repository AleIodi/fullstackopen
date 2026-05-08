import { Button, TextField } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserActions } from "../../store";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useUserActions()

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const success = await login({ username, password });
    setIsLoading(false);
    if (success) {
      setUsername("");
      setPassword("");
      navigate("/")
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
                readOnly: isLoading,
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
                readOnly: isLoading,
              },
            }}
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            name="Password"
          />
        </div>
        <Button sx={{ mt: 2 }} variant="contained" type="submit">
          LOGIN
        </Button>
      </form>
    </div>
  );
};

export default Login;
