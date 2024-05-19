import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: false,
}

export const loadingState = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    loading: (state) => {
      state.value = !state.value; 
    },
    
  },
})

export const {loading} = loadingState.actions

export default loadingState.reducer