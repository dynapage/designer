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
  Snackbar,
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
import SMTPsetting from "./SMTPsetting"

export default function SiteSettings() {
  const dispatch = useDispatch()
  const location = useLocation()
  const { applicationId } = useParams()
  const { appId, appName, appSiteName, selectedTable, selectedForm } =
    location.state || {}
  const [created, setCreated] = useState([])
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
  const [isLoading, setIsLoading] = useState(true)
  const [boards, setBoards] = useState([])
  const [isSaving, setIsSaving] = useState(false)
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")

  const showSnackbar = message => {
    setSnackbarMessage(message)
    setOpenSnackbar(true)
  }

  useEffect(() => {
    const getApplication = async () => {
      try {
        const res = await applicationApi.getOne(applicationId)
        dispatch(setApplication(res))
        setIsLoading(false)
      } catch (err) {
        showSnackbar("@126--" + err)
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
        showSnackbar("@138--" + err)
      }
    }
    getApplication()
  }, [teams])

  const fetchBoards = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/v1/boards/${application.dbname}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error("Failed to fetch boards")
      }

      const data = await response.json()
      setBoards(data)

      if (data.length === 0) {
        setColumns(["To do", "Active", "Closed"])
      } else {
        const firstBoardId = data[0]._id

        const sectionsResponse = await fetch(
          `http://localhost:5000/api/v1/boards/sections/${application.dbname}/all`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        if (!sectionsResponse.ok) {
          throw new Error("Failed to fetch sections")
        }

        const sectionsData = await sectionsResponse.json()
        const sectionsForFirstBoard = sectionsData.filter(
          section => section.board === firstBoardId
        )
        const sectionNames = sectionsForFirstBoard.map(section => section.title)

        setColumns(sectionNames)
      }
    } catch (error) {
      console.error("Error:", error.message)
    }
  }

  useEffect(() => {
    if (application === []) return
    console.log(application)

    fetchBoards()
  }, [application])

  useEffect(() => {
    if (application === []) return
    setIsKanbanEnabled(application?.kanban?.enabled)
    setIsTeamBoardEnabled(application?.kanban?.teamboard)
  }, [application])

  useEffect(() => {
    if (apptables) {
      setTbls(apptables)
    } else {
      setTbls([])
    }
  }, [apptables])

  const handleAddColumn = () => {
    if (columns.length >= 8) {
      showSnackbar("Maximum 8 columns allowed.")
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
      showSnackbar("Minimum 3 columns required.")
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

  const handleSaveChangesApplicatin = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/v1/application_save_changes/${applicationId}`,
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
      showSnackbar("Error saving data.")
    }
  }
  const createBoard = async boardData => {
    try {
      const response = await fetch("http://localhost:5000/api/v1/boards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(boardData),
      })

      const responseData = await response.json()
      for (let column of columns) {
        await createSection(responseData.id, column)
      }
    } catch (err) {
      console.error("Network error:", err)
      return null
    }
  }

  const createBoardsForAllTeams = async () => {
    for (let team of application.teams) {
      const newBoardData = {
        team: [team._id],
        dbName: application.dbname,
        title: boardName,
      }
      await createBoard(newBoardData)
    }
  }

  const createSingleBoardForAllTeams = async () => {
    const allTeamIds = application.teams.map(team => team._id)
    const newBoardData = {
      team: allTeamIds,
      dbName: application.dbname,
      title: boardName,
    }
    await createBoard(newBoardData)
  }

  const handleSaveChanges = async () => {
    setIsSaving(true)
    try {
      await handleSaveChangesApplicatin()
      if (!isKanbanEnabled) return
      if (boards.length === 0 || isSaving) {
        if (isTeamBoardEnabled) {
          await createBoardsForAllTeams()
        } else {
          await createSingleBoardForAllTeams()
        }
      }
      showSnackbar("Saved Successfully")
      fetchBoards()
    } catch (err) {
      showSnackbar("Error saving data.")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "90vh",
        }}
      >
        <CircularProgress size={45} />
      </div>
    )
  }

  const createSection = async (board, column) => {
    console.log(column)
    const url = "http://localhost:5000/api/v1/boards/sections/"
    const data = {
      dbName: application.dbname,
      board: board,
      title: column,
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const result = await response.json()
      console.log(result)
    } catch (error) {
      console.error("Error creating section:", error)
    }
  }

  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        message={snackbarMessage}
        action={
          <Button
            color="secondary"
            size="small"
            onClick={() => setOpenSnackbar(false)}
          >
            Close
          </Button>
        }
      />
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
              {boards.length > 0 && (
                <center>
                  <h3>
                    Board{boards.length > 1 ? "s" : ""} {boards[0].title}
                  </h3>
                </center>
              )}
              <TextField
                disabled={boards.length > 0}
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
                    disabled={boards.length > 0}
                    checked={isTeamBoardEnabled}
                    onChange={handleTeamBoardToggle}
                  />
                }
                label="Enable Individual Team Boards"
              />
              <h4>Columns</h4>
              <Button
                onClick={handleAddColumn}
                variant="contained"
                disabled={boards.length > 0}
                size="small"
              >
                Add Column
              </Button>
              <List>
                {Array.isArray(columns) &&
                  columns.map((column, index) => (
                    <ListItem key={index}>
                      <TextField
                        disabled={boards.length > 0}
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
                        disabled={boards.length > 0}
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
              onClick={handleSaveChanges}
              variant="contained"
              color="primary"
              disabled={isSaving}
            >
              {isSaving ? <CircularProgress size={24} /> : "Save"}
            </Button>
          </center>
          <SMTPsetting />
        </Box>
      </Box>
    </>
  )
}
