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
    addOwnedRoom:(state,action)=>{
        state.userInfo.OwnedRooms = [action.payload,...state.userInfo.OwnedRooms]
    },
    clearUserInfo:(state)=>{
        state.userInfo=null;
    }
  },
})

export const { setUserInfo,addOwnedRoom,clearUserInfo,setUserPost,setUserComment} = userState.actions

export default userState.reducer