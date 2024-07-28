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
    
    clearProfileInfo:(state)=>{
        state.profileInfo=null;
    }
  },
})

export const { setProfileInfo,clearProfileInfo} = profile.actions

export default profile.reducer