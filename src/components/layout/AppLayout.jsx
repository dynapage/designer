
import Box from '@mui/material/Box';

import Toolbar from '@mui/material/Toolbar';

import { useState, useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import authUtils from '../../utils/authUtils'
import Loading from '../common/Loading'
import Sidebar from '../common/Sidebar'
import { setUser } from '../../redux/features/userSlice'
import { NavigationBar } from '../common/NavigationBar';


const AppLayout = ({ themeMode }) => {
  const drawerWidth = 240;


  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const user = await authUtils.isAuthenticated()
      if (!user) {
        navigate('/login')
      } else {
        // save user
        dispatch(setUser(user))
        setLoading(false)
      }
    }
    checkAuth()
  }, [navigate])

  return (
    loading ? (
      <Loading fullHeight />
    ) : (
      <Box sx={{
        display: 'flex'
      }}>
        <NavigationBar selectedAppName={'Dynapage Designer'} />
        <Box sx={{ flexGrow: 1, display: 'flex' }}>
          <Sidebar themeMode={themeMode} />
          <Box component="main" sx={{ width: '100%' }}>
            <Toolbar />
            <Box sx={{ flexGrow: 1, justifyContent: 'center', width: '98%', border: 0 }} flexDirection="row"  >
              <Outlet />
            </Box>
          </Box>
        </Box>
      </Box>
    )
  )
}

export default AppLayout