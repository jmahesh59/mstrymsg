import mongoose from "mongoose";


type ConnectionObject = {
    isConnected? : number
}


const connnection : ConnectionObject={

}

async function dbConnect():Promise<void>{
    if(connnection.isConnected){
        console.log("Already connected to database")
        return
    }

    try {
        
        const db = await mongoose.connect(process.env.MONGODB_URI || "");

        connnection.isConnected = db.connections[0].readyState

        console.log("DB connected Successfully")

    } catch (error) {
        console.log("DB connection fail",error)
        process.exit();
    }
}

export default dbConnect