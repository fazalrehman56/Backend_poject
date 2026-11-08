import mongoose ,{Schema}from "mongoose";

const subscriptionSchema = new Schema({
    Subscriber:{
            type:mongoose.Types.ObjectId, // one who is subscribing 
            ref:"User",
            
         },
         Channel :{
            type:mongoose.Types.ObjectId, // one to whom "Subscriber" is subscribing
            ref:"User",
            
         },
},{timestamps : true});

export const Subscription = mongoose.model("Subscription",subscriptionSchema);