import { createSlice } from '@reduxjs/toolkit'
import { GiConsoleController } from 'react-icons/gi';

const initialState = {
  rooms:[],
}

export const userRooms = createSlice({
  name: 'rooms',
  initialState,
  reducers: {
    setRooms:(state,action)=>{
        state.rooms = action.payload
    },
    addNewRoom:(state,action)=>{
      state.rooms.push({room:action.payload});
    },
    updateRoomDetail:(state,action)=>{
      let a = [...state.rooms]
      let arr = a.filter((room)=>(room.room.id == action.payload.id));
      arr[0].room.title = action.payload.title;
    },
    clearRooms:(state)=>{
      state.rooms=[];
    },
  },
})

export const { setRooms,addNewRoom,clearRooms,updateRoomDetail } = userRooms.actions;

export default userRooms.reducer