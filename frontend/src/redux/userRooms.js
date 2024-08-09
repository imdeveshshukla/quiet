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
    clearRooms:(state)=>{
      state.rooms=[];
    },
  },
})

export const { setRooms,addNewRoom,clearRooms } = userRooms.actions;

export default userRooms.reducer