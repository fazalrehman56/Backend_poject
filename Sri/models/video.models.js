import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const videoSchema = new mongoose.Schema(
    {
     videofile:{
        type:String,//aws services
        required : true,
    
     },
     thubnail:{
        type:String, //aws services
        required : true,
       
     },
     owner:{
        type:mongoose.Types.ObjectId,
        ref:"User",
        required:true,
     },
     tittle:{
        type : String, // from aws kin services
        required : true,
        lowercase : true,
     },
      description:{
        type : String, 
        required : true,
        lowercase :true,

     },
     duaration:{
        type : Number, 
        required : true,
     },
     veiws:{
        type:Number,
        required : true,
     },
     ispubliched:{
        type:Boolean,
        default:false
     }
   },{timestamps:true})
   
 videoSchema.plugin(mongooseAggregatePaginate)
export const Video = mongoose.model("Video",videoSchema)
export const localTime = "11:26 PM";

