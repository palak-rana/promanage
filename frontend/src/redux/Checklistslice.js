import {createSlice} from "@reduxjs/toolkit"

const checklistslice = createSlice({
    name : "checklist",
    initialState : {
        priority : "",
        name : "",
        duedate : "",
        checklistarr : [],
        markedval : 0,
        sectiontype : "todo",
        filterchecklist : "This Month"
    },
    reducers : {
        addname : (state, action)=>{
            state.name = action.payload
        },
        addpriority : (state, action)=>{
            state.priority = action.payload
        },
        setfilterchecklist : (state, action)=>{
            state.filterchecklist = action.payload
        },
        addchecklist : (state, action)=>{
            state.checklistarr = [...state.checklistarr, {mark:false, data:""}]
        },
        updatechecklistcheckbox : (state, action)=>{
            state.checklistarr = [
                ...state.checklistarr.map((checklistobj, index) =>{
                    if(action.payload == index){
                        if(!checklistobj.mark) state.markedval = state.markedval + 1
                        else state.markedval = state.markedval - 1
                        return {mark : !checklistobj.mark, data:checklistobj.data}
                    }
                    else return checklistobj
                })
            ]

        },
        updatechecklistdata : (state, action) =>{
            state.checklistarr = [
                ...state.checklistarr.map((checklistobj, index) =>{
                    if(action.payload.index == index) return {mark : checklistobj.mark, data:action.payload.data}
                    else return checklistobj
                })
            ]    
        },
        deletechecklist:(state, action)=>{
            state.checklistarr = [
                ...state.checklistarr.filter((checklistobj, index) =>{
                    if(action.payload != index){
                        return checklistobj
                    }else{
                        if(checklistobj.mark) state.markedval = state.markedval - 1
                    }
                })
            ]    
        },
        setchecklistarr:(state, action) =>{
            state.checklistarr = action.payload
        },
        setchecklistmarkedval:(state, action)=>{
            state.markedval = action.payload
        },
        resetchecklist : (state, action) =>{
            state.name = ""
            state.priority = ""
            state.checklistarr = []
            state.duedate = ""
            state.markedval = 0
            state.sectiontype = "todo"
        },
        setdate:(state, action)=>{
            state.duedate = action.payload
        },
        setsectiontype:(state, action)=>{
            state.sectiontype = action.payload
        }
    }
})

export const {addname, setchecklistarr, setfilterchecklist, setchecklistmarkedval, setsectiontype, setdate, deletechecklist, resetchecklist, addpriority, addchecklist, updatechecklistcheckbox, updatechecklistdata} = checklistslice.actions
export default checklistslice.reducer