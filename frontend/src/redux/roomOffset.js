import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    roompostOffSet: 0,
    roompollOffSet: 0,
  },
};

export const roomoffsetState = createSlice({
  name: "roomoffset",
  initialState,
  reducers: {
    setRoomPostOffset: (state, action) => {
      state.value.roompostOffSet += action.payload;
    //   console.log("Inside RoomOFFet",state.value);
    },
    setRoomPollOffset: (state, action) => {
      state.value.roompollOffSet += action.payload;
    //   console.log("Inside RoomOFFet",state.value);
      
    },
    clearRoomOffset: (state) => {
      state.value.roompostOffSet=0;
      state.value.roompollOffSet=0;
    },
  },
});

export const {setRoomPostOffset, setRoomPollOffset, clearRoomOffset} = roomoffsetState.actions;

export default roomoffsetState.reducer;
