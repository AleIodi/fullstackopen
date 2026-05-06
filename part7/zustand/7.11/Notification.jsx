import { Alert, Snackbar } from "@mui/material";
import { useNotifyMessage, useNotifyType, useNotifyIsVisible } from "../../store";

const Notification = () => {
  const message = useNotifyMessage();
  const type = useNotifyType();
  const show = useNotifyIsVisible();

  return (
    <Snackbar
      open={show}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert severity={type} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Notification;
