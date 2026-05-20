import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";
import { Container } from "@mui/material";
import { NotificationContextProvider } from "./NotificationContext";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { UserContextProvider } from "./UserContext";

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById("root")).render(
  <UserContextProvider>
    <NotificationContextProvider>
      <QueryClientProvider client={queryClient}>
        <Container>
          <Router>
            <App />
          </Router>
        </Container>
      </QueryClientProvider>
    </NotificationContextProvider>
  </UserContextProvider>
);
