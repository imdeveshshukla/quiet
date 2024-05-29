import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  posts:null,
}

export const userPostState = createSlice({
  name: 'userPost',
  initialState,
  reducers: {
    setUserPost: (state,action) => {
      if(state.posts && !Array.isArray(action.payload)){
        state.posts= [...state.posts, action.payload];
      }
      else{
        state.posts=action.payload; 
      }
    },
  },
})

export const { setPost} = userPostState.actions

export default userPostState.reducer