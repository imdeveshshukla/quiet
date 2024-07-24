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
      // state.posts = [...state.posts, ...action.payload];
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
    clearPostsInfo:(state)=>{
      state.posts= [];
    }
  },
});

export const { setPost, setPostComment, toggleUpvote,clearPostsInfo } = postState.actions;

export default postState.reducer;
