import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: false,
}

export const onNewPostState = createSlice({
  name: 'onNewPost',
  initialState,
  reducers: {
    setOnNewPost: (state,action) => {
      state.value= action.payload; 
    },
  },
})

export const {setOnNewPost} = onNewPostState.actions

export default onNewPostState.reducer