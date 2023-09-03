import React, { useState } from "react"
import {
  Button,
  Divider,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  CircularProgress,
} from "@mui/material"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import { useSelector } from "react-redux"
import BoardColumnsManager from "./BoardColumnsManager"
import { useParams } from "react-router-dom"

function BoardsManager({
  setIsTeamBoardEnabled,
  isTeamBoardEnabled,
  showSnackbar,
  setIsBoardCreated,
  isBoardCreated,
  isSetBoards,
}) {
  const [isSaving, setIsSaving] = useState(false)
  const [boards, setBoards] = useState([
    {
      name: "",
      columns: ["To do", "Active", "Closed"],
    },
    {
      name: "",
      columns: ["To do", "Active", "Closed"],
    },
    {
      name: "",
      columns: ["To do", "Active", "Closed"],
    },
    {
      name: "",
      columns: ["To do", "Active", "Closed"],
    },
    {
      name: "",
      columns: ["To do", "Active", "Closed"],
    },
  ])
  const { teams, dbname } = useSelector(state => state.application.value)
  const token = localStorage.getItem("token")
  const { applicationId } = useParams()

  const [expandedAccordion, setExpandedAccordion] = useState(0)
  const handleSaveChangesApplicatin = async newteamboard => {
    try {
      const response = await fetch(
        process.env.REACT_APP_API_ROOT +
          `application_save_changes/${applicationId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            teamboard: newteamboard,
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
      showSnackbar("Error")
    }
  }

  const createBoard = async (boardData, boardIndex) => {
    setIsSaving(true)
    try {
      const response = await fetch(process.env.REACT_APP_API_ROOT + "boards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(boardData),
      })
      const responseData = await response.json()
      for (let column of boards[boardIndex].columns) {
        await createSection(responseData.id, column)
      }
      showSnackbar("Saved Successfully")
      setIsSaving(false)
      setIsBoardCreated(true)
      isSetBoards(responseData)
    } catch (err) {
      console.error("Network error:", err)
      showSnackbar("Saved Error")
      setIsSaving(false)
      return null
    }
  }

  const createBoards = async () => {
    const newBoardData = {
      dbname: dbname,
    }

    if (isTeamBoardEnabled) {
      for (let i = 0; i < teams.length; i++) {
        newBoardData.team = [teams[i]._id]
        newBoardData.title = boards[i].name
        await createBoard(newBoardData, i)
      }
    } else {
      newBoardData.team = teams.map(team => team._id)
      newBoardData.title = boards[0].name
      await createBoard(newBoardData, 0)
    }
  }

  const createSection = async (board, column) => {
    const url = process.env.REACT_APP_API_ROOT + "boards/sections/"
    const data = {
      dbname: dbname,
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
    } catch (error) {
      console.error("Error creating section:", error)
    }
  }

  return (
    <>
      <h3>Kanban Board</h3>
      <FormControl component="fieldset" margin="normal">
        <FormLabel component="legend">Select Board Type</FormLabel>
        <RadioGroup
          value={String(isTeamBoardEnabled)}
          onChange={() => {
            const newIsKanbanEnabled = !isTeamBoardEnabled
            setIsTeamBoardEnabled(newIsKanbanEnabled)
            handleSaveChangesApplicatin(newIsKanbanEnabled)
          }}
          row
        >
          <FormControlLabel
            value="false"
            control={<Radio />}
            label="A shared board accessible to all users across the entire site."
          />
          <FormControlLabel
            value="true"
            control={<Radio />}
            label="A board dedicated to each team (each team has access to its respective board)."
          />
        </RadioGroup>
      </FormControl>
      {!isTeamBoardEnabled && (
        <Accordion expanded TransitionProps={{ unmountOnExit: true }}>
          
          <AccordionDetails>
            <BoardColumnsManager
              board={boards[0]}
              boardIndex={0}
              setBoards={setBoards}
              showSnackbar={showSnackbar}
            />
          </AccordionDetails>
        </Accordion>
      )}
      {isTeamBoardEnabled &&
        teams.map((team, teamIndex) => (
          <Accordion
            key={teamIndex}
            expanded={expandedAccordion === teamIndex}
            onChange={() => setExpandedAccordion(teamIndex)}
            TransitionProps={{ unmountOnExit: true }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>{team.teamName} board</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <BoardColumnsManager
                board={boards[teamIndex]}
                boardIndex={teamIndex}
                setBoards={setBoards}
                showSnackbar={showSnackbar}
              />
            </AccordionDetails>
          </Accordion>
        ))}
      <Divider style={{ margin: "20px 0" }} />
      <center>
        <Button
          onClick={() => createBoards()}
          variant="contained"
          color="primary"
          disabled={isSaving || isBoardCreated}
        >
          {isSaving ? (
            <CircularProgress size={24} />
          ) : isBoardCreated ? (
            "Created"
          ) : (
            "Create"
          )}
        </Button>
      </center>
    </>
  )
}

export default BoardsManager
