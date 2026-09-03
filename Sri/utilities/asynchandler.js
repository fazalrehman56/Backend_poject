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

const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next))
    .catch((err) => {
        next(err);
    });
};
export default asyncHandler;