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
    delComment:(state,action)=>{
      let cmts = state.post.comments;
      cmts = cmts.filter((cmt)=>{
        return (cmt?.id !== action.payload)
      });
      console.log("Inside Redux");
      console.log(cmts);
      state.post.comments = [...cmts];
    },
    clearPostDetail:(state)=>{
      state.post=null;
    }
  },
})

export const { setPostDetail,setComment,clearPostDetail,delComment} = postDetailState.actions

export default postDetailState.reducer