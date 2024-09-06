import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  profileInfo:null,
}

export const profile = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfileInfo:(state,action)=>{
        state.profileInfo=action.payload;
    },
    setBgImg:(state,action)=>{
      if(state.profileInfo)
      state.profileInfo.bgImg= action.payload
    },
    setDp:(state,action)=>{
      if(state.profileInfo){
        state.profileInfo.dp= action.payload
      }
    },
    toggleUserInfoUpvote:(state,action)=>{
      if(state.profileInfo)
      {
        state.profileInfo._count.upvotes += action.payload;
      }
    },
    decreaseUserPost:(state)=>{
      if(state.profileInfo)
      {
        state.profileInfo._count.posts -= 1;
      }
    },
    clearProfileInfo:(state)=>{
        state.profileInfo=null;
    }
  },
})

export const { setProfileInfo,setBgImg,setDp,clearProfileInfo,toggleUserInfoUpvote,decreaseUserPost} = profile.actions

export default profile.reducer