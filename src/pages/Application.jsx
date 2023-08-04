
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'

import { Box, IconButton, TextField, Button } from '@mui/material'
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import CssBaseline from '@mui/material/CssBaseline';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';

import AddIcon from '@mui/icons-material/Add';
import NewAppForm from '../components/LevelApp/NewAppForm'
import TeamGrid from '../components/LevelApp/TeamGrid'
import applicationApi from '../api/applicationApi'

import { setApplications } from '../redux/features/applicationsSlice'
import { setApplication } from '../redux/features/applicationSlice'


let timer
const timeout = 500

const Application = () => {
 
  const user = useSelector((state) => state.user.value)


  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { applicationId } = useParams()
  const [name, setTitle] = useState('')
  const [newSite, setNewSite] = useState(false)
  const [sitename, setDescription] = useState('')
  const [sections, setSections] = useState([])
  const [isTeam, setIsTeam] = useState(false)
  const [icon, setIcon] = useState('')

  const application = useSelector((state) => state.application.value)
 

  useEffect(() => {
    const getApplication = async () => {
      try {
        const res = await applicationApi.getOne(applicationId)
        dispatch(setApplication(res))
        setTitle(res.name)
        setDescription(res.sitename)
        setSections(res.sections)
        setIsTeam(res.team)
        setIcon(res.icon)
      } catch (err) {
        alert(err)
      }
    }
    getApplication()
  }, [applicationId])


  const deleteApplication = async () => {
    try {
      if (application.name)
      {
        if (confirm("Are you sure you want to delete site " + application.name + "?") == true) {
          if (confirm("Deleting " + application.name + ", will delete all site data!, are you sure?") == true) {
            const res = await applicationApi.delete(applicationId, application.dbname, user.username)
            dispatch(setApplications(res));
            navigate(`/`)
          }
        }
      }
    } catch (err) {
      alert(err)
    }
  }

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <Stack spacing={2} sx={{ flexGrow: 1 }}>
          <Toolbar>
            <Box sx={{
              display: 'flex',
              alignItems: 'right',
              justifyContent: 'space-between',
              width: '80%'
            }}>
              <Button variant="contained" color="primary" disabled={newSite} onClick={() => setNewSite(true)} startIcon={<AddIcon />}>Add New site</Button>
            </Box>
            <Box sx={{
              display: 'flex',
              flexDirection: 'row-reverse',
              alignItems: 'right',
              justifyContent: 'space-between',
              width: '20%'
            }}>

              <IconButton variant='outlined' color='error' onClick={deleteApplication}>
                <DeleteOutlinedIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </Stack>
      </Box>
      <Divider />

      {newSite ?
        <center><NewAppForm designer={user.username} setNewSite={setNewSite} /></center>
        :
        <Box>

          <Box sx={{ padding: '10px 50px' }}>
            <Box >
              {/* emoji picker */}
              {/* <EmojiPicker icon={icon} onChange={onIconChange} /> */}
              <TextField
                value={name}
                //onChange={updateTitle}
                placeholder='Untitled'
                variant='outlined'
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-input': { padding: 0 },
                  '& .MuiOutlinedInput-notchedOutline': { border: 'unset ' },
                  '& .MuiOutlinedInput-root': { fontSize: '1rem', fontWeight: '700' }
                }}
              />
              <Grid container direction="row" alignItems="center" spacing={2}>
                <Grid item>
                  <div>Site number:</div>
                </Grid>
                <Grid item>
                  <TextField
                    value={sitename}
                    placeholder='Site Number'
                    variant='outlined'
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-input': { padding: 0 },
                      '& .MuiOutlinedInput-notchedOutline': { border: 'unset ' },
                      '& .MuiOutlinedInput-root': { fontSize: '2rem', fontWeight: '700' }
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
            <Box>
              <TeamGrid></TeamGrid>
            </Box>
          </Box></Box>
      }
    </>

  )
}

export default Application