import { createSlice } from '@reduxjs/toolkit'

const initialState = { data: {} }

export const tableSlice = createSlice({
  name: 'table',
  initialState,
  reducers: {
    setTable: (state, action) => {state.data = action.payload}
  }
})

export const { setTable } = tableSlice.actions

export default tableSlice.reducer