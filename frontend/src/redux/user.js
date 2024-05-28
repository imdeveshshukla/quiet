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
    clearUserInfo:(state)=>{
        state.userInfo=null;
    }
  },
})

export const { setUserInfo,clearUserInfo} = userState.actions

export default userState.reducer