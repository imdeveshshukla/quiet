import { configureStore } from '@reduxjs/toolkit'
import loginReducer from './login'
import loadingReducer from './loading'
import userReduser from './user'
import postReducer from './Post'
import skeltonReducer from './skelton'
import postDetailReducer from './Postdetail'
import userPostReducer  from './userposts'
import  HotPostReducer  from './Hotposts'
import NotificationReducer from './Notification'
import profileReducer from './profile'


export const store = configureStore({
  reducer: {
    login: loginReducer,
    loading: loadingReducer,
    user: userReduser,
    post: postReducer,
    skelton: skeltonReducer,
    postDetail: postDetailReducer,
    userpost: userPostReducer,
    hotpost: HotPostReducer,
    notification: NotificationReducer,
    profile: profileReducer,

  },
})
