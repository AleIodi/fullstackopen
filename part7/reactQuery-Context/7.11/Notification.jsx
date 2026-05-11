import { Alert } from "@mui/material";
import { useNotificationValue } from "../NotificationContext";

const Notification = () => {
  const {message, type} = useNotificationValue()

  if (message === null) {
    return null;
  }

  return (
    <Alert sx={{ mt: 3 }} severity={type}>
      {message}
    </Alert>
  );
};

export default Notification;
