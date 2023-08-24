import React from "react"
import { Snackbar, Button } from "@mui/material"

const CustomSnackbar = ({ open, message, handleClose }) => {
  return (
    <Snackbar
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      message={message}
      action={
        <Button color="secondary" size="small" onClick={handleClose}>
          Close
        </Button>
      }
    />
  )
}

export default CustomSnackbar
