import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI!
if (!MONGODB_URI) {
    throw new Error("Please define mongodb URL in env variable")
}

let cached = global.mongoose
if (!cached) {
    cached = global.mongoose = {conn:null, promise: null}
}

export async function ConnectDB () {
    if (cached.conn) {
        return cached.conn
    }

    if (!cached.promise) {
     cached.promise = mongoose.connect(MONGODB_URI).then(() => mongoose.connection)
    }

    try {
        const conn = await cached.promise
        return conn
    } catch (error) {
        cached.promise = null
        throw error
    }
}