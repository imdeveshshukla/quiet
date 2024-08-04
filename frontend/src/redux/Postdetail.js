import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  post:null,
}

export const postDetailState = createSlice({
  name: 'postDetail',
  initialState,
  reducers: {
    setPostDetail :(state,action)=>{
        state.post= action.payload
    },
    setComment:(state,action)=>{
      state.post.comments=[...state.post.comments, action.payload]
      
    },
    clearPostDetail:(state)=>{
      state.post=null;
    }
  },
})

export const { setPostDetail,setComment,clearPostDetail} = postDetailState.actions

export default postDetailState.reducer