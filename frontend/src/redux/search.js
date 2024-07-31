import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: false,
}

export const search = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setShowSearch: (state,actions) => {
      state.value = actions.payload;
      console.log(state.value);
    },
    
  },
})

export const {setShowSearch} = search.actions

export default search.reducer