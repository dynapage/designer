import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate, useLocation, useParams } from "react-router-dom"

import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  ExpandMoreIcon,
  CircularProgress,
  Checkbox,
  TextField,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  FormControlLabel,
  Divider,
  List,
  ListItem,
  IconButton,
  Button,
} from "@mui/material"
import DeleteIcon from "@mui/icons-material/Delete"

import PagesHeader from "../basics/PagesHeader"
import DnDEditor from "../DragAndDrop/DnDEditor"
import Generator from "../DragAndDrop/Generator"
import TrashCan from "../DragAndDrop/TrashCan"
import columnApi from "../../api/columnApi"
import applicationApi from "../../api/applicationApi"
import { setColumns } from "../../redux/features/columnsSlice"
import * as config from "../../config"
import { setApplication } from "../../redux/features/applicationSlice"

export default function SiteSettings() {
  const dispatch = useDispatch()
  const location = useLocation()
  const { applicationId } = useParams()
  const { appId, appName, appSiteName, selectedTable, selectedForm } =
    location.state || {}

  const application = useSelector(state => state.application.value)
  const { apptables } = application
  const { teams } = application
  const [teamsLoaded, setTeamsLoaded] = useState(false)
  const [tbls, setTbls] = useState([])
  const [isKanbanEnabled, setIsKanbanEnabled] = useState(false)
  const [isTeamBoardEnabled, setIsTeamBoardEnabled] = useState(false)
  const [boardName, setBoardName] = useState("")
  const [columns, setColumns] = useState([])
  const token = localStorage.getItem("token")

  useEffect(() => {
    const getApplication = async () => {
      try {
        const res = await applicationApi.getOne(applicationId)
        dispatch(setApplication(res))
      } catch (err) {
        alert("@126--" + err)
      }
    }
    getApplication()
  }, [applicationId])

  useEffect(() => {
    const getApplication = async () => {
      try {
        if (teams) setTeamsLoaded(true)
      } catch (err) {
        alert("@138--" + err)
      }
    }
    getApplication()
  }, [teams])

  useEffect(() => {
    if (apptables) {
      setTbls(apptables)
    } else {
      setTbls([])
    }
  }, [apptables])

  const handleAddColumn = () => {
    if (columns.length < 8) {
      setColumns([...columns, ""])
    } else {
      alert("Maximum 8 columns allowed.")
    }
  }
  const handleColumnNameChange = (index, newValue) => {
    const newColumns = [...columns]
    newColumns[index] = newValue
    setColumns(newColumns)
  }

  const handleDeleteColumn = index => {
    const newColumns = [...columns]
    newColumns.splice(index, 1)
    setColumns(newColumns)
  }

  const handleKanbanToggle = async event => {
    setIsKanbanEnabled(event.target.checked)
  }
  const handleTeamBoardToggle = event => {
    setIsTeamBoardEnabled(event.target.checked)
  }

  const handleBoardNameChange = async event => {
    setBoardName(event.target.value)
  }

  const handleSaveChanges = async () => {
    try {
      const response = await fetch(
        `https://dynaapi.azurewebsites.net/api/v1/application_save_changes/${applicationId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            kanban: {
              enabled: isKanbanEnabled,
              teamboard: isTeamBoardEnabled,
            },
          }),
        }
      )

      const responseData = await response.json()

      if (responseData) {
        console.log("Data saved successfully", responseData)
      } else {
        console.log("Failed to save data:", responseData)
      }
    } catch (err) {
      alert("Error saving data.")
    }
  }
  const createBoard = async boardData => {
    try {
      const response = await fetch(
        "https://dynaapi.azurewebsites.net/api/v1/boards",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(boardData),
        }
      )
      console.log(response)
    } catch (err) {
      console.error("Network error:", err)
      return null
    }
  }

  const newBoardData = {
    name: "New Board",
    description: "This is a new board",
  }
  return (
    <>
      <Box>
        <Box sx={{ padding: "10px 50px" }}>
          <PagesHeader
            name={application.name}
            sitename={application.sitename}
          ></PagesHeader>
          <Divider></Divider>
          <center>
            <h3>Dynapage Setting Site</h3>
          </center>
          <FormControlLabel
            control={
              <Checkbox
                checked={isKanbanEnabled}
                onChange={handleKanbanToggle}
              />
            }
            label="Enable Kanban Board"
          />
          {isKanbanEnabled && (
            <>
              <TextField
                label="Name of the Board"
                value={boardName}
                onChange={handleBoardNameChange}
                variant="outlined"
                fullWidth
                margin="normal"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isTeamBoardEnabled}
                    onChange={handleTeamBoardToggle}
                  />
                }
                label="Enable a Board for Each Team"
              />
              <h4>Columns</h4>
              <Button
                onClick={handleAddColumn}
                variant="contained"
                size="small"
              >
                Add Column
              </Button>
              <List>
                {Array.isArray(columns) &&
                  columns.map((column, index) => (
                    <ListItem key={index}>
                      <TextField
                        label={`Column ${index + 1} Name`}
                        value={column}
                        onChange={e =>
                          handleColumnNameChange(index, e.target.value)
                        }
                        variant="outlined"
                        fullWidth
                      />
                      <IconButton
                        edge="end"
                        onClick={() => handleDeleteColumn(index)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItem>
                  ))}
              </List>
            </>
          )}
          <center>
            <Button
              // onClick={() => createBoard(newBoardData)}
              onClick={handleSaveChanges}
              variant="contained"
              color="primary"
            >
              Save
            </Button>
          </center>
        </Box>
      </Box>
    </>
  )
}
