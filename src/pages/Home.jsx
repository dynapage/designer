import { useEffect, useState } from 'react'

import { Box } from "@mui/material"
import LoadingButton from '@mui/lab/LoadingButton'
import { useDispatch, useSelector } from 'react-redux'
import { setApplications } from "../redux/features/applicationsSlice"
import { useNavigate } from "react-router-dom"
import applicationApi from "../api/applicationApi"


import NewAppForm from '../components/LevelApp/NewAppForm'

const Home = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [newSite, setNewSite] = useState(false)

  const user = useSelector((state) => state.user.value)

  const createApplication = async () => {
    setLoading(true)
    try {

      setNewSite(true)

      // navigate(`/applications/${res.id}`)
    } catch (err) {
      alert(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <br />
      <br />
      <br />
      <Box>
        {newSite ?
          <center><NewAppForm designer={user.username} setNewSite={setNewSite} /></center>
          :
          <LoadingButton
            variant='outlined'
            color='success'
            disabled={newSite}
            onClick={createApplication}
            loading={loading}
          >
            Click here to create your first application
          </LoadingButton>}
      </Box>
    </Box>
  )
}

export default Home