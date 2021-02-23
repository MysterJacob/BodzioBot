module.exports.run = async(msg,Flags,Parameters,bot,ret)=>{
    let date = Parameters.get('date');
    date.setHours(0,0,0);
    if(Parameters.isSet('hour')){
        const hour = Parameters.get('hour');
        date.setHours(hour.getHours(),hour.getMinutes(),0);
    }


}
module.exports.config ={
    name:'cratetask',
    desc:'Used to create task',
    permissions:'111111',
    parameters:[{name:'name',type:'string',optional:false},{name:'date',type:'date',optional:false},{name:'hour',type:'hour',optional:true}],
    flags:{}
}