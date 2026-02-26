import { createSlice } from "@reduxjs/toolkit";

export const UserSlice= createSlice({

    name:'UserSlice',
    initialState:{
        user: null
    },
    reducers:{
        setUser(state,action){
            state.user = action.payload
        },
         removeUser(state,action){
            state.user = null
        },
    }
})


export const {removeUser,setUser } = UserSlice.actions;

export const UserSclicePath = (state:any)=>state.UserSclice.user