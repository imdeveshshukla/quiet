import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  posts:[],
};

export const postState = createSlice({
  name: "post",
  initialState,
  reducers: {
    setPost: (state, action) => {
      Array.from(action.payload).map(item=>{
        let elm= state.posts.find(it=> it.id==item.id )
        if(!elm)
          state.posts.push(item);
      })
    },
    setPostComment: (state, action) => {
      let post = state.posts.find((post) => post.id == action.payload.postId);
      if(post){
        post.comments = [action.payload, ...post.comments];
      }

    },
    toggleUpvote: (state, action) => {
      let post = state.posts.find((post) => post.id == action.payload.postId);
      let upvotes;
      if (post) {
        upvotes = post.upvotes;

        let index = upvotes.findIndex(
          (vote) => vote.userId == action.payload.userId
        );

        if (index != -1) {
          upvotes[index] = action.payload;

        } else {

          upvotes[upvotes.length] = action.payload;

        }
      }
    },
    clearPostsInfo:(state)=>{
      state.posts= [];
    }
  },
});

export const { setPost, setPostComment, toggleUpvote,clearPostsInfo } = postState.actions;

export default postState.reducer;
