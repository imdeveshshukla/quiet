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
    },
    toggleUpvote: (state,action)=>{
      
      let post =state.posts.find(post=>post.id==action.payload.postId);
      let upvotes= post.upvotes;
      
      let index= upvotes.findIndex(vote=> vote.userId==action.payload.userId)
      console.log(index,upvotes);
      

      
      if(index!=-1){
        upvotes[index]= action.payload;

        console.log(upvotes);
        
      }
      else{
        upvotes= [...upvotes, action.payload]
        console.log("else",upvotes);
        
      }
    }
  },
})

export const { setPost,setPostComment,toggleUpvote} = postState.actions

export default postState.reducer