import { createSlice } from '@reduxjs/toolkit'

const initialState = { value: [] }

export const teamSlice = createSlice({
  name: 'teams',
  initialState,
  reducers: {
    setTeamList: (state, action) => {
      state.value = action.payload
    }
  }
})

export const { setTeamList } = teamSlice.actions

export default teamSlice.reducer