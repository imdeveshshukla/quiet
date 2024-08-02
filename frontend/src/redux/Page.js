import { createSlice } from '@reduxjs/toolkit'

export const Page = createSlice({
  name: 'page',
  initialState: {
    value: 1
  },
  reducers: {
    increment: state => {
      state.value += 1
    },
    decrement: state => {
      state.value -= 1
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload
    },
    Reset:(state,action)=>{
        state.value = 1;
    }
  }
})

export const { Reset,increment, decrement, incrementByAmount } = Page.actions

export default Page.reducer