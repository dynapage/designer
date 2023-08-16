import "@fontsource/roboto/300.css"
import "@fontsource/roboto/400.css"
import "@fontsource/roboto/500.css"
import "@fontsource/roboto/700.css"
import "./css/custom-scrollbar.css"
import "./css/custom-scrollbar.css"
import CssBaseLine from "@mui/material/CssBaseline"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import AppLayout from "./components/layout/AppLayout"
import AuthLayout from "./components/layout/AuthLayout"
import Home from "./pages/Home"
import Application from "./pages/Application"
import NewAppForm from "./components/LevelApp/NewAppForm"
import TableGrid from "./components/LevelTableForm/TableGrid"
import FormGrid from "./components/LevelTableForm/FormGrid"
import SectionEditor from "./components/SectionEditor"
import Signup from "./pages/Signup"
import Login from "./pages/Login"
import SiteSettings from "./components/LevelTableForm/SiteSettings"

function App({ params }) {
  const userTheme = localStorage.getItem("userTheme")

  const theme = createTheme({
    palette: { mode: userTheme ? userTheme : "light" },
  })

  return (
    <ThemeProvider theme={theme}>
      <CssBaseLine />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AuthLayout />}>
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
          </Route>
          <Route
            path="/"
            element={<AppLayout themeMode={theme.palette.mode} />}
          >
            <Route index element={<Home />} />
            <Route path="applications" element={<Home />} />
            <Route
              path="applications/:applicationId"
              element={<Application />}
            />
            <Route path="addapplication" element={<NewAppForm />} />
            <Route path="tables/:applicationId" element={<TableGrid />} />
            <Route path="forms/:applicationId" element={<FormGrid />} />
            <Route
              path="sections/:applicationId"
              element={<SectionEditor themeMode={theme.palette.mode} />}
            />
            <Route
              path="sitesettings/:applicationId"
              element={<SiteSettings />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
