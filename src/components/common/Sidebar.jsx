import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import {
  Box,
  Drawer,
  IconButton,
  List,
  Button,
  ListItem,
  ListItemButton,
  Typography,
} from "@mui/material"
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined"
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined"
import { Link, useNavigate, useParams } from "react-router-dom"
import assets from "../../assets/index"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import applicationApi from "../../api/applicationApi"
import { setApplications } from "../../redux/features/applicationsSlice"
import { setApplication } from "../../redux/features/applicationSlice"
import ListItemText from "@mui/material/ListItemText"
import Divider from "@mui/material/Divider"

const Sidebar = ({ themeMode }) => {
  const user = useSelector(state => state.user.value)
  const applications = useSelector(state => state.applications.value)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { applicationId } = useParams()
  const [activeIndex, setActiveIndex] = useState(0)
  const userTheme = localStorage.getItem("userTheme")
  const sidebarWidth = 250

  useEffect(() => {
    const getApplications = async () => {
      try {
        const res = await applicationApi.getAll(user.username)
        dispatch(setApplications(res))
      } catch (err) {
        alert("@5032--" + err)
      }
    }
    getApplications()
  }, [dispatch])

  useEffect(() => {
    try {
      const activeItem = applications.findIndex(e => e.id === applicationId)
      if (applications.length > 0 && applicationId === undefined) {
        navigate(`/applications/${applications[0]._id}`)
      }
      setActiveIndex(activeItem)
    } catch (err) {
      alert("--@34 ", err)
    }
  }, [applications, applicationId, navigate])

  const setCurrentSite = async id => {
    const res = await applicationApi.getOne(id)
    dispatch(setApplication(res))
  }

  const logout = () => {
    localStorage.removeItem("token")
    navigate("/login")
  }

  const changeTheme = () => {
    if (userTheme === "dark") {
      localStorage.setItem("userTheme", "light")
    } else {
      localStorage.setItem("userTheme", "dark")
    }
    window.location.reload()
  }

  return (
    <Drawer
      container={window.document.body}
      variant="permanent"
      open={true}
      sx={{
        width: sidebarWidth,
        height: "100vh",
        "& > div": { borderRight: "none" },
      }}
    >
      <br />
      <br />
      <List
        disablePadding
        sx={{
          width: sidebarWidth,
          height: "100vh",
          backgroundColor:
            themeMode == "light"
              ? assets.colors.secondary
              : assets.colors.primaryDark,
        }}
      >
        <br />
        <ListItem>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="body2" fontWeight="700">
              {user.username}
            </Typography>
            <IconButton onClick={logout}>
              <LogoutOutlinedIcon fontSize="small" />
            </IconButton>
          </Box>
        </ListItem>
        <Box sx={{ paddingTop: "10px" }} />
        {/* <FavouriteList /> */}
        <Box sx={{ paddingTop: "10px" }} />
        <ListItem>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="body2" fontWeight="700">
              My Dynapage Sites
            </Typography>
          </Box>
        </ListItem>
        {applications &&
          applications.map((item, index) => (
            <Box>
              <Divider />
              <br />
              <Typography
                variant="body2"
                fontWeight="700"
                sx={{
                  pl: 2,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {item.icon} {item.name + " (" + item.sitename + ")"}
              </Typography>
              <List component="div" disablePadding>
                <ListItemButton
                  selected={index === activeIndex}
                  component={Link}
                  to={`/applications/${item._id}`}
                  sx={{
                    pl: 4,
                    pl: "30px",
                    cursor: "pointer!important",
                  }}
                >
                  <ListItemText primary="Teams and users" />
                </ListItemButton>
                <ListItemButton
                  selected={index === activeIndex}
                  component={Link}
                  onClick={() => setCurrentSite(item._id)}
                  to={`/tables/${item._id}`}
                  sx={{
                    pl: 4,
                    pl: "30px",
                    cursor: "pointer!important",
                  }}
                >
                  <ListItemText primary="Site tables" />
                </ListItemButton>
                <ListItemButton
                  selected={index === activeIndex}
                  component={Link}
                  onClick={() => setCurrentSite(item._id)}
                  to={`/forms/${item._id}`}
                  sx={{
                    pl: 4,
                    pl: "30px",
                    cursor: "pointer!important",
                  }}
                >
                  <ListItemText primary="Forms" />
                </ListItemButton>
                <ListItemButton
                  selected={index === activeIndex}
                  component={Link}
                  onClick={() => setCurrentSite(item._id)}
                  to={`/sitesettings/${item._id}`}
                  sx={{
                    pl: 4,
                    pl: "30px",
                    cursor: "pointer!important",
                  }}
                >
                  <ListItemText primary="Site settings" />
                </ListItemButton>
              </List>
            </Box>
          ))}
      </List>
      <Button onClick={changeTheme}>
        {userTheme === "dark" ? "Light theme" : "Dark theme"}{" "}
      </Button>
    </Drawer>
  )
}

export default Sidebar
