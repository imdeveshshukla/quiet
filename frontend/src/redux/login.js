import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: false,
}

export const loginState = createSlice({
  name: 'login',
  initialState,
  reducers: {
    login: (state) => {
      state.value = true; 
    },
    logout: (state) => {
      state.value = false;
    },
  },
})

export const { login, logout} = loginState.actions

export default loginState.reducer