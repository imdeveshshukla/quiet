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
import hamburgerReducer from './hamburger'
import SearchReducer from './search'
import roomReducer from './roomSlice'
import userRoomsReducer from './userRooms'
import PageReducer from './Page'
import { roomsApi } from '../pages/RoomApis'
import welcomeStateReducer  from './welcome'
import onNewPostReducer from './onNewPost'
import offsetReducer from './offset'

import userPollReducer  from './userpolls'
import roomCreatePostReducer from './RoomCreatePosts'
import roomOffsetReducer from './roomOffset'



export const store = configureStore({
  reducer: {
    login: loginReducer,
    loading: loadingReducer,
    user: userReduser,
    post: postReducer,
    skelton: skeltonReducer,
    postDetail: postDetailReducer,
    userpost: userPostReducer,
    userpoll: userPollReducer,
    hotpost: HotPostReducer,
    notification: NotificationReducer,
    profile: profileReducer,
    hamburger: hamburgerReducer,
    search: SearchReducer,
    room:roomReducer,
    rooms:userRoomsReducer,
    page:PageReducer,
    welcome: welcomeStateReducer,
    roomsApi:roomsApi.reducer,
    onNewPost: onNewPostReducer,
    offset: offsetReducer,
    roomCreatePost:roomCreatePostReducer,
    roomOffset : roomOffsetReducer
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(roomsApi.middleware),
})
