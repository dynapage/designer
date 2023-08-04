import { createSlice } from '@reduxjs/toolkit'

const initialState = { value: {} }

export const tablesSlice = createSlice({
  name: 'tables',
  initialState,
  reducers: {
    setTables: (state, action) => {
      state.value = action.payload
    }
  }
})

export const { setTables } = tablesSlice.actions

export default tablesSlice.reducer