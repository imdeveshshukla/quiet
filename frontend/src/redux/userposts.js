import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  posts: [],
};

export const userPostState = createSlice({
  name: "userpost",
  initialState,
  reducers: {
    setPost: (state, action) => {
      Array.from(action.payload).map(item=>{
        let elm= state.posts.find(it=> it.id==item.id )
        if(!elm)
          state.posts.push(item);
      })
      // state.posts = [...state.posts, ...action.payload];
    },
    deleteUserPost:(state,action)=>{
      state.posts= state.posts.filter(post=>post.id!==action.payload)
    },
    setUserPostComment: (state, action) => {
      let post = state.posts.find((post) => post.id == action.payload.postId);

      if(post){
        post.comments = [action.payload, ...post.comments];
      }

    },
    toggleUserUpvote: (state, action) => {
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
    clearUserPostsInfo: (state) => {
      state.posts = [];
    },
  },
});

export const { setPost,deleteUserPost, setUserPostComment, toggleUserUpvote, clearUserPostsInfo } =
  userPostState.actions;

export default userPostState.reducer;
