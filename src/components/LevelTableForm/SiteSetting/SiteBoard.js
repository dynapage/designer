import React, { useEffect, useState, useMemo, useCallback } from "react"
import {
  TextField,
  Checkbox,
  FormControlLabel,
  Icon,
  Button,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import { useSelector } from "react-redux"
import ColumnsManagerEdit from "./ColumnsManagerEdit"

export default function EditDescription({
  boards,
  showSnackbar,
  checkBoardLength,
  setCheckBoardLength,
}) {
  const [data, setData] = useState([])
  const [expandedAccordion, setExpandedAccordion] = useState(0)
  const { teams, dbname } = useSelector(state => state.application.value)
  const token = localStorage.getItem("token")

  useEffect(() => {
    setData(boards)
  }, [boards])

  const handleChange = useCallback((index, key, value) => {
    setData(prevData => {
      const newData = [...prevData]
      newData[index][key] = value
      return newData
    })
  }, [])

  const handleUpdated = async (boardIndex, boardId) => {
    try {
      const boardToUpdate = data[boardIndex]
      const requestData = {
        ...boardToUpdate,
        dbname: dbname,
      }
      const response = await fetch(
        process.env.REACT_APP_API_ROOT + `boards/${boardId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestData),
        }
      )
      const responseData = await response.json()
      if (response.ok) {
        console.log(responseData)
        showSnackbar("Updated")
      } else {
        console.error("Failed to update section:", responseData)
        showSnackbar("Error updating section.")
      }
    } catch (err) {
      console.error("Error:", err)
      showSnackbar("Error updating section.")
    }
  }

  const handleDeleteBoard = async (boardIndex, boardId) => {
    try {
      const response = await fetch(
        process.env.REACT_APP_API_ROOT + `boards/${boardId}?dbname=${dbname}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.ok) {
        const newData = [...data]
        newData.splice(boardIndex, 1)
        setData(newData)
        showSnackbar("Board deleted successfully")

        if (newData.length === 0) {
          setCheckBoardLength(!checkBoardLength)
        }
      } else {
        const responseData = await response.json()
        console.error("Failed to delete board:", responseData)
        showSnackbar("Error deleting board.")
      }
    } catch (err) {
      console.error("Error:", err)
      showSnackbar("Error deleting board.")
    }
  }

  const boardForMemoized = useMemo(() => {
    return data.map(item => {
      const team = teams.find(t => t._id === item.team[0])
      if (item.team.length > 1) {
        return "the whole team"
      } else {
        return team ? team.teamName : "Unknown Team"
      }
    })
  }, [data, teams])

  return (
    <>
      <center>
        <Typography variant="h6" gutterBottom>
          My Board{data.length > 1 ? "s" : ""}
        </Typography>
      </center>
      {data.map((item, idx) => {
        return (
          <Accordion
            key={idx}
            expanded={expandedAccordion === idx}
            onChange={() => setExpandedAccordion(idx)}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">
                Setting Board for {boardForMemoized[idx]}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div style={{ width: "100%" }}>
                <Accordion>
                  <AccordionSummary>
                    <Typography>Title</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <TextField
                      fullWidth
                      value={item.title}
                      onChange={e => handleChange(idx, "title", e.target.value)}
                    />
                  </AccordionDetails>
                </Accordion>

                <Accordion>
                  <AccordionSummary>
                    <Typography>Description</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      value={item.description}
                      onChange={e =>
                        handleChange(idx, "description", e.target.value)
                      }
                    />
                  </AccordionDetails>
                </Accordion>

                <Accordion>
                  <AccordionSummary>
                    <Typography>Icon</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <TextField
                      fullWidth
                      value={item.icon}
                      onChange={e => handleChange(idx, "icon", e.target.value)}
                    />
                  </AccordionDetails>
                </Accordion>

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={item.favourite}
                      onChange={e =>
                        handleChange(idx, "favourite", e.target.checked)
                      }
                      color="primary"
                    />
                  }
                  label="Favourite"
                />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    handleUpdated(idx, item.id)
                  }}
                  style={{ marginTop: "20px" }}
                >
                  Updated Board
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleDeleteBoard(idx, item.id)}
                >
                  Delete Board
                </Button>
              </div>
            </AccordionDetails>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Column Control</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <ColumnsManagerEdit
                  boardId={item.id}
                  showSnackbar={showSnackbar}
                />
              </AccordionDetails>
            </Accordion>
          </Accordion>
        )
      })}
    </>
  )
}
