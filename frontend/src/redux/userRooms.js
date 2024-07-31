import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  rooms:[],
}

export const userRooms = createSlice({
  name: 'rooms',
  initialState,
  reducers: {
    setRooms:(state,action)=>{
        state.rooms = action.payload
        console.log("Inside setRooms slice");
    },
    clearRooms:(state)=>{
      state.rooms=[];
    },
  },
})

export const { setRooms,clearRooms } = userRooms.actions;

export default userRooms.reducer