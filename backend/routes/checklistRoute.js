const router = require("express").Router()
const Checklistmodel = require("../model/Checklistmodel")

router.post("/addchecklist", async (req, res) =>{
    const {priority, name, duedate, createdAt, markedval, checklistarr, userid, sectiontype} = req.body
    try{
        const checklist = new Checklistmodel({priority, name, createdAt, duedate, checklistarr, markedval, userid, sectiontype})
        const newchecklist = await checklist.save()
        res.json({
            newchecklist
        })
    }catch(err){
        res.json({
            message : "something went wrong"
        })
    }
})

router.get("/getchecklist/:id", async (req, res) =>{
    const {id} = req.params
    const {time} = req.query
    try{
        if(time == "all"){
            const allchecklist = await Checklistmodel.find({userid : id})
            return res.json({
                allchecklist
            })
        }
        const allchecklist = await Checklistmodel.find({userid : id, createdAt : time})
        res.json({
            allchecklist
        })
    }catch(err){
        res.json({
            message : "something went wrong"
        })
    }
})

router.delete("/deletechecklist/:id", async (req, res) =>{
    const {id} = req.params
    try{
        const deletedchecklist = await Checklistmodel.findByIdAndDelete(id)
        res.json({
            deletedchecklist
        })
    }catch(err){    
        res.json({
            message : "something went wrong"
        })
    }
})

router.patch("/updatechecklist/:id", async (req, res) =>{
    const {id} = req.params
    const {priority, name, duedate, markedval, checklistarr, sectiontype} = req.body
    try{
        if(priority){
            const updatedchecklist = await Checklistmodel.findByIdAndUpdate(id, {
                priority, name, duedate, markedval, checklistarr, sectiontype
            })
            return res.json({
                updatedchecklist
            })
        }
        if(sectiontype){
            const updatedchecklist = await Checklistmodel.findByIdAndUpdate(id, {sectiontype})
            return res.json({
                updatedchecklist
            })
        }
        const updatedchecklist = await Checklistmodel.findByIdAndUpdate(id, {markedval, checklistarr})
        res.json({
            updatedchecklist
        })
    }catch(err){
        res.json({
            message : "something went wrong"
        })
    }
})

router.get("/getsinglechecklist/:id", async (req, res) =>{
    const {id} = req.params
    try{
        const singlechecklist = await Checklistmodel.findById(id)
        res.json({
            singlechecklist
        })
    }catch(err){
        res.json({
            message : "something went wrong"
        })
    }
})
module.exports = router