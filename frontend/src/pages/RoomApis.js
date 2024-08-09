import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import baseAddress from '../utils/localhost'

export const roomsApi = createApi({
    reducerPath:"roomsApi",
    baseQuery:fetchBaseQuery({
        baseUrl:baseAddress,
        credentials:'include',
    }),
    tagTypes: ['Room'],
    endpoints:(builder)=>({
        getRoomDetails : builder.query({ 
            query: (title)=> `rooms/showRoom/${title}`,
            providesTags: (result, error, title) => [{ type: 'Room', id: title }],
         }),
         updateRoomDetails: builder.mutation({
             invalidatesTags: (result, error, { id }) => [{ type: 'Room', id }],
        }),
            // invalidatesTags: (result, error, { title }) => [{ type: 'Room', id: title }],
    }),
});

export const { useGetRoomDetailsQuery,useUpdateRoomDetailsMutation } = roomsApi