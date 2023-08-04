import { createSlice } from '@reduxjs/toolkit'

const initialState = { value: [] }

export const applicationSlice = createSlice({
  name: 'application',
  initialState,
  reducers: {
    setApplication: (state, action) => {
      state.value = action.payload
    }
  }
})

export const { setApplication } = applicationSlice.actions

export default applicationSlice.reducer