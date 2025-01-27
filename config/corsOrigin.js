import allowedOrigin from './allowedOrigin.js'
const corsOption={
    origin:(origin,callback)=>{
        if(allowedOrigin.indexOf(origin)!==-1||!origin){
            callback(null,true);
        }
        else{
            callback(new Error("Not allowed by cors"));
        }
    },
    credentials:true,
    optionsSuccessStatus:200
}
export default corsOption;