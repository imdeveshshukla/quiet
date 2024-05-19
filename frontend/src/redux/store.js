import { configureStore } from '@reduxjs/toolkit'
import loginReducer from './login'
import loadingReducer from './loading'



export const store = configureStore({
  reducer: {
    login: loginReducer,
    loading: loadingReducer,
  },
})
