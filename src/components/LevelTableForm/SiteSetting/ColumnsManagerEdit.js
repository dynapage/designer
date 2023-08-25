import React, { useState, useEffect } from "react"
import {
  TextField,
  Button,
  List,
  ListItem,
  IconButton,
  Divider,
} from "@mui/material"
import DeleteIcon from "@mui/icons-material/Delete"
import { useSelector } from "react-redux"
import { handleDeleteColumn } from "./siteSettingsHelpers"

export default function ColumnsManagerEdit({ showSnackbar, boardId, boards }) {
  const [columns, setColumns] = useState([])
  const token = localStorage.getItem("token")
  const { dbname } = useSelector(state => state.application.value)

  useEffect(() => {
    const fetchColumns = async () => {
      try {
        const response = await fetch(
          process.env.REACT_APP_API_ROOT +
            `/boards/sections/${dbname}/${boardId}/all`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        )
        const data = await response.json()
        setColumns(data)
      } catch (error) {
        console.error("Error fetching columns:", error)
        showSnackbar("Error fetching columns")
      }
    }
    fetchColumns()
  }, [boards])

  const handleUpdated = async () => {
    try {
      const response = await fetch(
        process.env.REACT_APP_API_ROOT + `/boards/sections/${boardId}/all`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            columns: columns.map(column => column.title),
            dbname: dbname,
          }),
        }
      )
      if (response.ok) {
        showSnackbar("Successfully updated columns!")
      } else {
        showSnackbar("Error updating columns")
      }
    } catch (error) {
      console.error("Error updating columns:", error)
      showSnackbar("Error updating columns")
    }
  }

  const handleAddColumnClick = () => {
    if (columns.length >= 8) {
      showSnackbar("Maximum 8 columns allowed.")
      return
    }
    const newColumn = {
      _id: Date.now().toString(),
      title: "",
    }
    setColumns([...columns, newColumn])
  }

  const handleDeleteColumnClick = columnIndex => {
    const updatedColumns = handleDeleteColumn(
      columns,
      columnIndex,
      showSnackbar
    )
    setColumns(updatedColumns)
  }

  const handleColumnChange = (columnId, e) => {
    const updatedName = e.target.value
    const updatedColumns = columns.map(column =>
      column._id === columnId ? { ...column, title: updatedName } : column
    )
    setColumns(updatedColumns)
  }

  return (
    <>
      <Divider style={{ margin: "20px 0" }} />
      <Button onClick={handleAddColumnClick} variant="contained" size="small">
        Add Column
      </Button>
      <List>
        {Array.isArray(columns) &&
          columns.map((column, columnIndex) => (
            <ListItem key={columnIndex}>
              <TextField
                label={`Column ${columnIndex + 1} Name`}
                value={column.title || ""}
                onChange={e => handleColumnChange(column._id, e)}
                variant="outlined"
                fullWidth
              />
              <IconButton
                edge="end"
                onClick={() => handleDeleteColumnClick(columnIndex)}
              >
                <DeleteIcon />
              </IconButton>
            </ListItem>
          ))}
      </List>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleUpdated()}
        style={{ marginTop: "20px" }}
      >
        Update Columns
      </Button>
    </>
  )
}
