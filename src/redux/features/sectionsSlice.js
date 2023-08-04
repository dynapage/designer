
import { createSlice } from '@reduxjs/toolkit'


const initialState = { value: {} }



const sectionsSlice = createSlice({
  name: 'sections',
  initialState,
  reducers: {
    getSections: (state, action) => {
      state.data =
        action.payload;
    },
    
  }
})

export const { getSections} = sectionsSlice.actions

export default sectionsSlice.reducer