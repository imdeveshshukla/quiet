import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  polls: [],
};

export const userPollState = createSlice({
  name: "userpoll",
  initialState,
  reducers: {
    setPoll: (state, action) => {
      Array.from(action.payload).map(item=>{
        let elm= state.polls.find(it=> it.id==item.id )
        if(!elm)
          state.polls.push(item);
      })
      
    },
    deleteUserPoll:(state,action)=>{
      state.polls= state.polls.filter(poll=> poll.id!==action.payload);
    },
    setUserPollvote: (state, action) => {
      const { optionId,userId, option: { pollId } } = action.payload;
  
      state.polls = state.polls.map(poll => {
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
  
    
  },
    
    clearPollInfo: (state) => {
      state.polls = [];
    },
  },
});

export const { setPoll,setUserPollvote,deleteUserPoll, clearPollInfo } =
  userPollState.actions;

export default userPollState.reducer;
