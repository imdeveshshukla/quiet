import { configureStore } from '@reduxjs/toolkit'
import loginReducer from './login'
import loadingReducer from './loading'
import userReduser from './user'
import postReducer from './Post'
import skeltonReducer from './skelton'
import postDetailReducer from './Postdetail'
import userPostReducer  from './userposts'


export const store = configureStore({
  reducer: {
    login: loginReducer,
    loading: loadingReducer,
    user: userReduser,
    post: postReducer,
    skelton: skeltonReducer,
    postDetail: postDetailReducer,
    userpost: userPostReducer,
  },
})
