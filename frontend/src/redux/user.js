import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  userInfo:null,
}

export const userState = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserInfo:(state,action)=>{
        state.userInfo=action.payload;
    },
    setUserPost:(state,action)=>{
        state.userInfo.posts= [...state.userInfo.posts, action.payload]
    },
    clearUserInfo:(state)=>{
        state.userInfo=null;
    }
  },
})

export const { setUserInfo,clearUserInfo,setUserPost} = userState.actions

export default userState.reducer