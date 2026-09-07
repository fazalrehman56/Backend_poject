import multer from "multer";

const storage = multer.diskStorage({ //disk m store hohi file
  destination: function (req, file, cb) { // cb mtlb ye batata hn multer ko k kia resuly aya no need of return
    // if (someErrorCondition) {
    //     return cb(new Error("Something went wrong"))
    // }//rn no need of ifelse
    cb(null, './public/temp') // // file kha save hongi
},
  filename: function (req, file, cb) { //file kis name say save hogi
   
      // if (err) return cb(err)
      cb(null, file.originalname)
    
  }
})

 export const upload = multer({ 
    storage, 
})