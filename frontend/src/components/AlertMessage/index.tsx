import { Alert, Snackbar } from "@mui/material";

interface ISnackBar {
  open: boolean;
  message: string;
  setOpen: (open: boolean) => void;
  severity?: 'success' | 'error' | 'warning' | 'info';
  onClick?: () => void;
}
export const AlertMessage = ({
  open,
  message,
  setOpen,
  severity,
  onClick,
}: ISnackBar) => {
  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };
  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      onClick={onClick}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert
        severity={severity}
        variant="filled"
        sx={{ width: '100%' }}
        onClose={handleClose}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};