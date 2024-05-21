import { configureStore } from '@reduxjs/toolkit'
import loginReducer from './login'
import loadingReducer from './loading'
import userReduser from './user'


export const store = configureStore({
  reducer: {
    login: loginReducer,
    loading: loadingReducer,
    user: userReduser,
  },
})
