class ApiError extends Error{

    constructor(
        statusCode,
        msg = "something went worng",
        error=[],
        stack=""
    ){
        super(msg)
        this.statusCode = statusCode
        this.data = null
        this.error = error
        this.success = false

        if(stack){
            this.stack = stack
        }
        else{
             error.capturestacktrace(this,this.constructor)
        }
    }
}
export  default ApiError
