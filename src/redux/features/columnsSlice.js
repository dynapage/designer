import { createSlice } from '@reduxjs/toolkit'

const initialState = { value: {} }

export const columnsSlice = createSlice({
  name: 'columns',
  initialState,
  reducers: {
    setColumns: (state, action) => {
      state.value = action.payload
      
    }
  }
})

export const { setColumns } = columnsSlice.actions

export default columnsSlice.reducer


