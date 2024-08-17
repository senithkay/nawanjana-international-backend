import {formatString} from "./Common";

export const logger = (error: any)=> {
    let description = ''
    if (error.errors !== undefined && error.errors !== null) {
        const key = Object.keys(error.errors)[0]
        const cause = error.errors[key]
        if (cause.properties === undefined || cause.properties.message ===undefined) {
            console.log(error.errors)
            return;
        }
        else{
            description = cause.properties.message;
        }

    }
    else if (error.code !== undefined && error.code !== null && error.code === 11000){
        const key = Object.keys(error.keyValue)[0]
        const cause = error.keyValue[key]
        description = `This ${formatString(key)} : ${cause} is already in use`
    }
    else{
        console.log(error)
        return
    }
    console.log(description)
}