import { configureStore } from "@reduxjs/toolkit"
import userReducer from './features/userSlice'
import applicationsReducer from './features/applicationsSlice'
import applicationReducer from './features/applicationSlice'
import teamReducer from './features/teamSlice'
import tableReducer from './features/tableSlice'
import tablesReducer from './features/tablesSlice'
import formReducer from './features/formSlice'
import columnsReducer from './features/columnsSlice'
import { sections } from './features/sections'

export const store = configureStore({
  reducer: {
    user: userReducer,
    applications: applicationsReducer,
    application: applicationReducer,
    table: tableReducer,
    tables: tablesReducer,
    columns: columnsReducer,
    form: formReducer,
    teams: teamReducer,
    sections: sections,
    
  }
})