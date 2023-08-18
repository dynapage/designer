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
  const [columns, setColumns] = useState(["To do", "Active", "Closed"])
  const token = localStorage.getItem("token")
  const [isLoading, setIsLoading] = useState(true)

  console.log(application)
  useEffect(() => {
    if (application === []) return
    setIsKanbanEnabled(application?.kanban?.enabled)
    setIsTeamBoardEnabled(application?.kanban?.teamboard)
  }, [application])

  useEffect(() => {
    const getApplication = async () => {
      try {
        const res = await applicationApi.getOne(applicationId)
        dispatch(setApplication(res))
        setIsLoading(false)
      } catch (err) {
        alert("@126--" + err)
        setIsLoading(false)
      }
    }
    getApplication()
  }, [applicationId, dispatch])

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
    if (columns.length >= 8) {
      alert("Maximum 8 columns allowed.")
      return
    }
    setColumns([...columns, ""])
  }

  const handleColumnNameChange = (index, newValue) => {
    const newColumns = [...columns]
    newColumns[index] = newValue || ""
    setColumns(newColumns)
  }

  const handleDeleteColumn = index => {
    if (columns.length <= 3) {
      alert("Minimum 3 columns required.")
      return
    }
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

  // useEffect(() => {
  //   const fetchColumnsForBoard = async boardId => {
  //     try {
  //       const response = await fetch(
  //         `https://dynaapi.azurewebsites.net/api/v1/boards/${boardId}/sections`,
  //         {
  //           method: "GET",
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       )

  //       if (!response.ok) {
  //         throw new Error("Failed to fetch columns")
  //       }

  //       return await response.json()
  //     } catch (error) {
  //       console.error("Error:", error.message)
  //     }
  //   }
  //   const fetchData = async () => {
  //     const fetchedColumns = await fetchColumnsForBoard(boardId) // замените `boardId` на актуальный ID вашей доски
  //     setColumns(fetchedColumns)
  //   }

  //   fetchData()
  // }, [])

  const saveColumnToServer = async (boardId, dbName) => {
    try {
      const response = await fetch(
        `https://dynaapi.azurewebsites.net/api/v1/boards/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error("Failed to save column")
      }

      const data = await response.json()
      console.log("Column saved successfully:", data)
    } catch (error) {
      console.error("Error:", error.message)
    }
  }

  const updateColumnTitle = async newTitle => {
    try {
      const response = await fetch(
        `https://dynaapi.azurewebsites.net/api/v1/boards/64df6d0685d61c005ee93809/64ce9d1b75d853005b11b53d/sections/64df739485d61c005ee93854`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title: newTitle }),
        }
      )

      if (!response.ok) {
        throw new Error("Failed to update column title")
      }

      const data = await response.json()
      console.log("Column updated successfully:", data)
    } catch (error) {
      console.error("Error:", error.message)
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

      const responseData = await response.json()
      console.log(responseData)
    } catch (err) {
      console.error("Network error:", err)
      return null
    }
  }

  const newBoardData = {
    id: "64dccfb1388e8f0058ae76a7",
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <>
      <Box>
        <Box sx={{ padding: "10px 50px" }}>
          {application && (
            <PagesHeader
              name={application?.name}
              sitename={application?.sitename}
            />
          )}
          <Divider />
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
                      <Button
                        onClick={
                          () =>
                            saveColumnToServer(
                              "64df7b5085d61c005ee9387f",
                              "64dccfb1388e8f0058ae76a7"
                            )
                          // updateColumnTitle(column)
                        }
                        // onClick={() => console.log(column)}
                        variant="contained"
                        size="small"
                        style={{ marginLeft: "10px" }}
                      >
                        Save Column
                      </Button>
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
