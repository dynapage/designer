import {
  Divider,
  TextField,
  Button,
  FormControlLabel,
  Select,
  MenuItem,
  Switch,
} from "@mui/material"
import React, { useState } from "react"

export default function SMTPsetting() {
  const [isOpen, setIsOpen] = useState(false)
  const [smtpSettings, setSmtpSettings] = useState({
    server: "",
    port: "",
    username: "",
    password: "",
    authMethod: "",
    useSSL: false,
  })

  const handleSaveSmtpSettings = async () => {
    try {
      const response = await fetch(
        `https://dynaapi.azurewebsites.net/api/v1/smtp_settings_save/${applicationId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(smtpSettings),
        }
      )

      const responseData = await response.json()
      if (responseData) {
        console.log("SMTP settings saved successfully", responseData)
      } else {
        console.log("Failed to save SMTP settings:", responseData)
      }
    } catch (err) {
      alert("Error saving SMTP settings.")
    }
  }

  return (
    <>
      <div>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? "Close SMTP Settings" : "Open SMTP Settings"}
        </Button>

        {isOpen && (
          <>
            <Divider />
            <center>
              <h3>SMTP Settings</h3>
            </center>
            <TextField
              label="SMTP Server"
              value={smtpSettings.server}
              onChange={e =>
                setSmtpSettings({ ...smtpSettings, server: e.target.value })
              }
              variant="outlined"
              fullWidth
              margin="normal"
            />
            <TextField
              label="SMTP Port"
              value={smtpSettings.port}
              onChange={e =>
                setSmtpSettings({ ...smtpSettings, port: e.target.value })
              }
              variant="outlined"
              fullWidth
              margin="normal"
            />
            <TextField
              label="SMTP Username"
              value={smtpSettings.username}
              onChange={e =>
                setSmtpSettings({ ...smtpSettings, username: e.target.value })
              }
              variant="outlined"
              fullWidth
              margin="normal"
            />
            <TextField
              type="password"
              label="SMTP Password"
              value={smtpSettings.password}
              onChange={e =>
                setSmtpSettings({ ...smtpSettings, password: e.target.value })
              }
              variant="outlined"
              fullWidth
              margin="normal"
            />
            <Select
              value={smtpSettings.authMethod}
              onChange={e =>
                setSmtpSettings({ ...smtpSettings, authMethod: e.target.value })
              }
              fullWidth
              variant="outlined"
              margin="normal"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="PLAIN">PLAIN</MenuItem>
              <MenuItem value="LOGIN">LOGIN</MenuItem>
              <MenuItem value="CRAM-MD5">CRAM-MD5</MenuItem>
            </Select>
            <FormControlLabel
              control={
                <Switch
                  checked={smtpSettings.useSSL}
                  onChange={e =>
                    setSmtpSettings({
                      ...smtpSettings,
                      useSSL: e.target.checked,
                    })
                  }
                />
              }
              label="Use SSL"
            />
            <Button
              onClick={handleSaveSmtpSettings}
              variant="contained"
              color="primary"
            >
              Save SMTP Settings
            </Button>
          </>
        )}
      </div>
    </>
  )
}
