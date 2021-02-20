//Module resposible for logs
const fs = require("fs");
const path = require("path")
module.exports = function(attachedModule){
    let filename = path.basename(attachedModule);
    filename = filename.slice(0,filename.indexOf("."))
    let returned = {};
    returned.print = function(message){
        const date = new Date()

        let hour = date.getHours()
        if(hour <=9){
            hour = "0" + hour
        } 
        let minute = date.getMinutes()
        if(minute <=9){
            minute = "0" + minute
        } 
        let seconds = date.getSeconds()
        if(seconds <=9){
            seconds = "0" + seconds
        } 

        const time = hour+":"+minute+":"+seconds
        console.log("["+time+"]["+filename+"]"+message);
    }
    returned.error = function(message){
        const date = new Date()

        let hour = date.getHours()
        if(hour <=9){
            hour = "0" + hour
        } 
        let minute = date.getMinutes()
        if(minute <=9){
            minute = "0" + minute
        } 
        let seconds = date.getSeconds()
        if(seconds <=9){
            seconds = "0" + seconds
        } 

        const time = hour+":"+minute+":"+seconds
        console.log("["+time+"]["+filename+"] CRITICAL ERROR");
        console.log(message)
    }
    return returned
}
module.exports.config ={
    name:"logger"
}