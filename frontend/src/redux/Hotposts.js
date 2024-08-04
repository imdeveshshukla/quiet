import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  hotposts: [],
};

export const HotPostState = createSlice({
  name: "hotpost",
  initialState,
  reducers: {
    setHotPost: (state, action) => {
      Array.from(action.payload).map(item=>{
        let elm= state.hotposts.find(it=> it.id==item.id )
        if(!elm)
          state.hotposts.push(item);
      })
    },
    setHotPostComment: (state, action) => {
      let post = state.hotposts.find((post) => post.id == action.payload.postId);

      if(post){
        post.comments = [action.payload, ...post.comments];
      }

    },
    toggleUserUpvote: (state, action) => {
      let post = state.hotposts.find((post) => post.id == action.payload.postId);
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
    clearHotPostsInfo: (state) => {
      state.hotposts = [];
    },
  },
});

export const { setHotPost, setHotPostComment, toggleUserUpvote, clearHotPostsInfo } =
  HotPostState.actions;

export default HotPostState.reducer;
