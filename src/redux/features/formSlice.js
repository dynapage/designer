import { createSlice } from '@reduxjs/toolkit'

const initialState = { value: {} }

export const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    setForm: (state, action) => {
      state.value = action.payload
    }
  }
})

export const { setForm } = formSlice.actions

export default formSlice.reducer