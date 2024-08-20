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
    addEnrolledRoom:(state,action)=>{
      state.userInfo.Room = [action.payload,...state.userInfo.Room]
    },
    addLeetCodeID:(state,action)=>{
      state.userInfo = {...state.userInfo, leetcode: action.payload}
    },
    setShowLC: (state,action)=>{
      state.userInfo = {...state.userInfo, showLC: action.payload}

    },
    addCodeforceRank:(state,action)=>{
      state.userInfo = {...state.userInfo, codeforces: action.payload}
    },
    setshowCf: (state,action)=>{
      state.userInfo = {...state.userInfo, showCf: action.payload}

    },
    clearUserInfo:(state)=>{
        state.userInfo=null;
    }
  },
})

export const { setUserInfo,addOwnedRoom,addEnrolledRoom,clearUserInfo,setUserPost,setUserComment, addLeetCodeID, setShowLC,addCodeforceRank,setshowCf} = userState.actions

export default userState.reducer