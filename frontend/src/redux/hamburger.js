import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: false,
}

export const hamburger = createSlice({
  name: 'hamburger',
  initialState,
  reducers: {
    setShowSideNav: (state,actions) => {
      state.value = actions.payload;
      console.log(state.value);
    },
    
  },
})

export const {setShowSideNav} = hamburger.actions

export default hamburger.reducer