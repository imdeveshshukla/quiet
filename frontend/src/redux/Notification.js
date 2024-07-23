import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notifications:[],
};

export const Notification = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setNotification: (state, action) => {
      state.notifications= [ ...action.payload];
    },
    updateNotification:(state,action)=>{
      const newArr= state.notifications.filter(item=> item.id!=action.payload);
      state.notifications= [...newArr];
    },
    
    clearNotification:(state)=>{
      state.notifications= [];
    }
  },
});

export const { setNotification, clearNotification, updateNotification } = Notification.actions;

export default Notification.reducer;
