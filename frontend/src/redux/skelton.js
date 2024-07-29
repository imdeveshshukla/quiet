import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: false,
}

export const skeltonState = createSlice({
  name: 'skelton',
  initialState,
  reducers: {
    setSkeltonLoader: (state) => {
      state.value = !state.value; 
      console.log("skelton", state.value);
      
    },
    
  },
})

export const {setSkeltonLoader} = skeltonState.actions

export default skeltonState.reducer