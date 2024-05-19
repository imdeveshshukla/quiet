import { configureStore } from '@reduxjs/toolkit'
import loginReducer from './login'



export const store = configureStore({
  reducer: {
    login: loginReducer,
  },
})
