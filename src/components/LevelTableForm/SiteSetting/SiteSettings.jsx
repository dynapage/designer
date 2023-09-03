import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useParams } from "react-router-dom"
import {
  Box,
  CircularProgress,
  Divider,
  Switch,
  Typography,
  FormControl,
  FormControlLabel 
} from "@mui/material"
import PagesHeader from "../../basics/PagesHeader"
import applicationApi from "../../../api/applicationApi"
import { setApplication } from "../../../redux/features/applicationSlice"
import CustomSnackbar from "../../ui/CustomSnackbar"
import BoardsManager from "./BoardsManager"
import SiteBoard from "./SiteBoard"

export default function SiteSettings() {
  const dispatch = useDispatch()
  const { applicationId } = useParams()
  const application = useSelector(state => state.application.value)
  const [isKanbanEnabled, setIsKanbanEnabled] = useState(false)
  const [isTeamBoardEnabled, setIsTeamBoardEnabled] = useState(false)
  const [boards, setBoards] = useState([])
  const [isBoards, setIsBoards] = useState([])
  const token = localStorage.getItem("token")
  const [isLoading, setIsLoading] = useState(true)
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [isBoardCreated, setIsBoardCreated] = useState(false)
  const [checkBoardLength, setCheckBoardLength] = useState(false)

  const showSnackbar = message => {
    setSnackbarMessage(message)
    setOpenSnackbar(true)
  }

  useEffect(() => {
    const getApplication = async () => {
      try {
        const res = await applicationApi.getOne(applicationId)
        dispatch(setApplication(res))
      } catch (err) {
        showSnackbar("@126--" + err)
      }
    }
    getApplication()
  }, [applicationId, dispatch])

  useEffect(() => {
    if (!application.dbname) return
    const getBoards = async () => {
      try {
        const response = await fetch(
          process.env.REACT_APP_API_ROOT + `boards/${application.dbname}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        )
        const responseData = await response.json()
        if (response.ok) {
          setBoards(responseData)
        } else {
          console.error("Failed to fetch boards:", responseData)
          showSnackbar("Error fetching boards.")
        }
      } catch (err) {
        console.error("Error:", err)
        showSnackbar("Error fetching boards.")
      } finally {
        setIsLoading(false)
        setIsBoardCreated(false)
      }
    }
    getBoards()
  }, [application.dbname, isKanbanEnabled, isBoards, checkBoardLength])

  useEffect(() => {
    if (application === []) return
    setIsKanbanEnabled(application?.kanbanenabled)
    setIsTeamBoardEnabled(application?.teamboard)
  }, [application])

  const handleSaveChangesApplicatin = async newIsKanbanEnabled => {
    try {
      const response = await fetch(
        process.env.REACT_APP_API_ROOT +
          `application_save_changes/${applicationId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            kanbanenabled: newIsKanbanEnabled,
          }),
        }
      )
      const responseData = await response.json()
      if (responseData) {
        console.log("Data saved successfully")
      } else {
        console.log("Failed to save data:")
      }
    } catch (err) {
      showSnackbar("Error saving data.")
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

  return (
    <>
      <CustomSnackbar
        open={openSnackbar}
        message={snackbarMessage}
        handleClose={() => setOpenSnackbar(false)}
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
            <Typography variant="h6">Dynapage Site Settings..</Typography>
          </center>
          

<FormControlLabel
          control={
            <Switch size="small" 
            checked={isKanbanEnabled}
            onChange={() => {
              const newIsKanbanEnabled = !isKanbanEnabled
              setIsKanbanEnabled(newIsKanbanEnabled)
              handleSaveChangesApplicatin(newIsKanbanEnabled)
            }}
          ></Switch>
          }
          label="Enable Kanban Board for this site"
        />

          {isKanbanEnabled && boards.length === 0 && (
            <BoardsManager
              isTeamBoardEnabled={isTeamBoardEnabled}
              setIsTeamBoardEnabled={setIsTeamBoardEnabled}
              showSnackbar={showSnackbar}
              isBoardCreated={isBoardCreated}
              isSetBoards={setIsBoards}
              setIsBoardCreated={setIsBoardCreated}
            />
          )}
          {isKanbanEnabled && boards.length > 0 && (
            <>
              <SiteBoard
                boards={boards}
                showSnackbar={showSnackbar}
                checkBoardLength={checkBoardLength}
                setCheckBoardLength={setCheckBoardLength}
              />
            </>
          )}
        </Box>
      </Box>
    </>
  )
}
