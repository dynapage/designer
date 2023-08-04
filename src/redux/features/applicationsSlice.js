import { createSlice } from '@reduxjs/toolkit'

const initialState = { value: [] }

export const applicationsSlice = createSlice({
  name: 'applications',
  initialState,
  reducers: {
    setApplications: (state, action) => {
      state.value = action.payload
    }
  }
})

export const { setApplications } = applicationsSlice.actions

export default applicationsSlice.reducer