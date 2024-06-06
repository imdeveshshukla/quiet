import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  posts: [],
};

export const userPostState = createSlice({
  name: "userpost",
  initialState,
  reducers: {
    setPost: (state, action) => {
      state.posts = [...state.posts, ...action.payload];
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
        console.log(action.payload);

        let index = upvotes.findIndex(
          (vote) => vote.userId == action.payload.userId
        );

        if (index != -1) {
          upvotes[index] = action.payload;

          console.log(upvotes);
        } else {
          console.log("length", upvotes.length);

          upvotes[upvotes.length] = action.payload;

          console.log("else", upvotes);
        }
      }
    },
    clearPostsInfo: (state) => {
      state.posts = [];
    },
  },
});

export const { setPost, setUserPostComment, toggleUserUpvote, clearPostsInfo } =
  userPostState.actions;

export default userPostState.reducer;
