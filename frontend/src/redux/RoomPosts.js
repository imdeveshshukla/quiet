import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  hotposts: [],
};

export const RoomPostState = createSlice({
  name: "roomPosts",
  initialState,
  reducers: {
    setRoomPost: (state, action) => {
      Array.from(action.payload).map(item=>{
        let elm= state.hotposts.find(it=> it.id==item.id )
        if(!elm)
          state.hotposts.push(item);
      })
    },
    setRoomPostComment: (state, action) => {
      let post = state.hotposts.find((post) => post.id == action.payload.postId);

      if(post){
        post.comments = [action.payload, ...post.comments];
      }

    },
    toggleUserRoomUpvote: (state, action) => {
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
    deleteRoomPostsInfo:(state,action)=>{
      let posts = state.hotposts.filter((post)=> post.id != action.payload);
      state.hotposts = [...posts];
    },
    clearRoomPostsInfo: (state) => {
      state.hotposts = [];
    },
  },
});

export const { setRoomPost, setRoomPostComment, toggleUserRoomUpvote, clearRoomPostsInfo, deleteRoomPostsInfo } = RoomPostState.actions;

export default RoomPostState.reducer;
