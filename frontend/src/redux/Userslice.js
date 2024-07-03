import {createSlice} from "@reduxjs/toolkit"

const userslice = createSlice({
    name : "user",
    initialState : {
        userid : localStorage.getItem("user") && JSON.parse(localStorage.getItem("user")).userid || "",
        jwt : localStorage.getItem("user") && JSON.parse(localStorage.getItem("user")).jwt || "",
        name : localStorage.getItem("user") && JSON.parse(localStorage.getItem("user")).name || "",
        checklisteditid : null
    },
    reducers : {
        adduser : (state, action) =>{
            state.userid = action.payload.userid
            state.jwt = action.payload.jwttoken
            state.name = action.payload.name
            localStorage.setItem("user", JSON.stringify(state))
        },
        resetuser : (state, action) =>{
            state.userid = ""
            state.jwt = ""
            state.name = ""
            localStorage.setItem("user", JSON.stringify(state))
        },
        setchecklistid : (state, action) =>{
            state.checklisteditid = action.payload
        },
        resetchecklistid:(state)=>{
            state.checklisteditid = null
        },
        updatename: (state, action)=>{
            state.name = action.payload
            localStorage.setItem("user", JSON.stringify(state))
        }
    }
})

export const {updatename, adduser, resetuser, setchecklistid, resetchecklistid} = userslice.actions
export default userslice.reducer