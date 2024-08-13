import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  roomInfo:null,
}

export const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {
    setRoomDetail:(state,action)=>{
        state.roomInfo = action.payload
    },

    changeBgImg:(state,action)=>{
      state.roomInfo.bgImg = action.payload
    },
    changeDpImg:(state,action)=>{
      state.roomInfo.img = action.payload
    },
    clearRoomDetail:(state)=>{
      state.roomInfo=null;
    },
  },
})

export const { setRoomDetail,changeBgImg,clearRoomDetail, changeDpImg } = roomSlice.actions;

export default roomSlice.reducer