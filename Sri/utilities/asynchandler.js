// const asyncHandler = (fn)=> async(res,req,next)=>{
//    try{
//      await fn(res,req,next)
//    }
//    catch(err){
//         err.status(err.code||500).json({
//             success : false,
//             message : err.message,
//         })
//    }
// }

const asyncHandler = (fn)=> (res,req,next)=>{
    Promise.resolve(fn(res,req,next))
    .catch((err)=>{
           next(err)
    })
 }
