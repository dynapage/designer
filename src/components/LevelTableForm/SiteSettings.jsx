import { useEffect, useState, useCallback } from "react"
import PropTypes from "prop-types"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Alert from "@mui/material/Alert"
import Snackbar from "@mui/material/Snackbar"
import {
  GridRowModes,
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
} from "@mui/x-data-grid"

import { setApplication } from "../../redux/features/applicationSlice"
import Divider from "@mui/material/Divider"
import formApi from "../../api/formApi"
import applicationApi from "../../api/applicationApi"
import PagesHeader from "../basics/PagesHeader"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate, useLocation, useParams } from "react-router-dom"
import AddIcon from "@mui/icons-material/Add"
import EditIcon from "@mui/icons-material/Edit"
import SaveIcon from "@mui/icons-material/Save"
import CancelIcon from "@mui/icons-material/Close"

export default function SiteSettings() {
  const dispatch = useDispatch()
  const location = useLocation()
  const { applicationId } = useParams()

  const application = useSelector(state => state.application.value)
  const { apptables } = application
  const { teams } = application
  const [teamsLoaded, setTeamsLoaded] = useState(false)
  const [tbls, setTbls] = useState([])

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
        </Box>
      </Box>
    </>
  )
}
