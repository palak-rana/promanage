const mongoose = require("mongoose")

const Checklistschema = new mongoose.Schema({
    priority : {type : String, required : true},
    name : {type : String, required : true},
    duedate : {type : String},
    checklistarr : {type:Array, required:true},
    markedval : {type : Number, required : true},
    createdAt : {type : Number, required : true},
    userid : {type : String, required:true},
    sectiontype : {type:String, required:true}
})

module.exports = mongoose.model("Checklist", Checklistschema)