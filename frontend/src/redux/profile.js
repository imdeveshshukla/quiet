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
    clearProfileInfo:(state)=>{
        state.profileInfo=null;
    }
  },
})

export const { setProfileInfo,setBgImg,setDp,clearProfileInfo,toggleUserInfoUpvote} = profile.actions

export default profile.reducer