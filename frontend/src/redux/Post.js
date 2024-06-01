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
        state.posts= [action.payload,...state.posts];
      }
      else{
        state.posts=action.payload; 
      }
    },
    setPostComment:(state,action)=>{
      let post= state.posts.find(post=>post.id==action.payload.postId);
      console.log(post);
      
      post.comments= [ action.payload,...post.comments];
    }
  },
})

export const { setPost,setPostComment} = postState.actions

export default postState.reducer