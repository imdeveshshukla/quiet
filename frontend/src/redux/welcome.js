import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: false,
}

export const welcomeState = createSlice({
  name: 'welcome',
  initialState,
  reducers: {
    show: (state) => {
      state.value = true; 
    },
    hide: (state) => {
      state.value = false;
    },
  },
})

export const { show, hide} = welcomeState.actions

export default welcomeState.reducer