import { configureStore } from '@reduxjs/toolkit'
import loginReducer from './login'
import loadingReducer from './loading'
import userReduser from './user'
import postReducer from './Post'
import userPostReducer from './Userpost'
import postDetailReducer from './Postdetail'

export const store = configureStore({
  reducer: {
    login: loginReducer,
    loading: loadingReducer,
    user: userReduser,
    post: postReducer,
    userPost: userPostReducer,
    postDetail: postDetailReducer,
  },
})
