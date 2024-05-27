import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  posts:null,
}

export const postState = createSlice({
  name: 'post',
  initialState,
  reducers: {
    setPost: (state,action) => {
      if(state.posts && !Array.isArray(action.payload)){
        state.posts= [...state.posts, action.payload];
      }
      else{
        state.posts=action.payload; 
      }
    },
  },
})

export const { setPost} = postState.actions

export default postState.reducer