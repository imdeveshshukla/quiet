import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: {
    roomTitle:null,
    roomCreatorId:null,
    onNewRoomPost:false
  },
}

export const roomCreatePost = createSlice({
  name: 'RoomCreatePost',
  initialState,
  reducers: {
    addRoomTitle: (state,action) => {
      state.value.roomTitle = action.payload; 
    },
    addRoomCreatorId:(state,action)=>{
      state.value.roomCreatorId = action.payload; 
    },
    setOnNewRoomPost:(state,action)=>{
      state.value.onNewRoomPost = action.payload;
    }
  },
})

export const {addRoomTitle,addRoomCreatorId,setOnNewRoomPost} = roomCreatePost.actions

export default roomCreatePost.reducer