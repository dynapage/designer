import React from "react"
import {
  TextField,
  Button,
  List,
  ListItem,
  IconButton,
  Divider,
} from "@mui/material"
import DeleteIcon from "@mui/icons-material/Delete"
import {
  handleAddColumn,
  handleColumnNameChange,
  handleDeleteColumn,
} from "./siteSettingsHelpers"

const BoardColumnsManager = ({
  board,
  boardIndex,
  setBoards,
  showSnackbar,
}) => {
  const handleBoardNameChange = e => {
    const newName = e.target.value
    setBoards(prevBoards => {
      const newBoards = [...prevBoards]
      newBoards[boardIndex] = { ...newBoards[boardIndex], name: newName }
      return newBoards
    })
  }

  const handleAddColumnClick = () => {
    const updatedColumns = handleAddColumn(board.columns, showSnackbar)
    setBoards(prevBoards => {
      const newBoards = [...prevBoards]
      newBoards[boardIndex] = {
        ...newBoards[boardIndex],
        columns: updatedColumns,
      }
      return newBoards
    })
  }

  const handleColumnChange = (columnIndex, e) => {
    const updatedName = e.target.value
    const updatedColumns = handleColumnNameChange(
      board.columns,
      columnIndex,
      updatedName
    )
    setBoards(prevBoards => {
      const newBoards = [...prevBoards]
      newBoards[boardIndex] = {
        ...newBoards[boardIndex],
        columns: updatedColumns,
      }
      return newBoards
    })
  }

  const handleDeleteColumnClick = columnIndex => {
    const updatedColumns = handleDeleteColumn(
      board.columns,
      columnIndex,
      showSnackbar
    )
    setBoards(prevBoards => {
      const newBoards = [...prevBoards]
      newBoards[boardIndex] = {
        ...newBoards[boardIndex],
        columns: updatedColumns,
      }
      return newBoards
    })
  }

  return (
    <>
      <TextField
        label="Board Name"
        value={board.name}
        onChange={handleBoardNameChange}
        variant="outlined"
        fullWidth
      />
      <Divider style={{ margin: "20px 0" }} />
      <Button onClick={handleAddColumnClick} variant="contained" size="small">
        Add Column
      </Button>
      <List>
        {Array.isArray(board.columns) &&
          board.columns.map((column, columnIndex) => (
            <ListItem key={columnIndex}>
              <TextField
                label={`Column ${columnIndex + 1} Name`}
                value={column}
                onChange={e => handleColumnChange(columnIndex, e)}
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
    </>
  )
}

export default BoardColumnsManager
