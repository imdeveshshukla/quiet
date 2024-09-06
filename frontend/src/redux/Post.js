import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  posts:[],
};

export const postState = createSlice({
  name: "post",
  initialState,
  reducers: {
    setPost: (state, action) => {
      const newPosts = action.payload;
      
      // Filter out any posts that already exist based on their ID
      const uniquePosts = newPosts.filter(
        (newPost) => !state.posts.some((post) => post.id === newPost.id)
      );
      
      // Append unique posts to the state
      state.posts = [...state.posts, ...uniquePosts];
     
    },
    deleteHomePost:(state,action)=>{
      state.posts= state.posts.filter(post=>post.id!==action.payload)
    },
  
    
    
    setPollvote: (state, action) => {
      const { optionId, userId, option: { pollId } } = action.payload;
  
      state.posts = state.posts.map(poll => {
          if (poll.id === pollId) {
              const updatedOptions = poll.options.map(option => {

                  const updatedVotes = option.votes.filter(vote => vote.userId !== userId);
  
                  if (option.id === optionId) {

                      return {
                          ...option,
                          votes: [...updatedVotes, action.payload] 
                      };
                  }
  
                  return {
                      ...option,
                      votes: updatedVotes
                  };
              });
  
              return {
                  ...poll,
                  options: updatedOptions
              };
          }
          return poll;
      });
  
      
  }
  
  ,
  

  

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

export const { setPost,deleteHomePost, setPostComment,setPollvote,deleteHomePoll, toggleUpvote,clearPostsInfo } = postState.actions;

export default postState.reducer;
