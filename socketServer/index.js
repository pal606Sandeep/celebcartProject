import express from "express"
import http from "http"
import dotenv from "dotenv"
import { Server } from "socket.io"
import axios from "axios"
dotenv.config()

const app = express();
app.use(express.json());

const server = http.createServer(app)
const port = process.env.PORT || 5000

const io = new Server(server,{
    cors:{
        origin:process.env.NEXT_BASE_URL
    }
})

io.on("connection",(socket)=>{
     socket.on("identity",async (userId)=>{
        try {
            await axios.post(`${process.env.NEXT_BASE_URL}/api/socket/connect`, {socketId:socket.id,userId},)
        } catch (error) {
           console.log(error);
        }
     })

     socket.on("updateLocation", async({userId,latitude,longitude})=>{
    try {
        const location = {
            type:"Point",
            coordinates:[longitude, latitude]
        }
        await axios.post(`${process.env.NEXT_BASE_URL}/api/socket/update-location`, {userId, location})

        io.emit("update-deliveryBoy-location",{userId, location})
    } catch (error) {
        console.log(error);
    }
     })

    //  socket.on("join-room",(roomId)=>{
    //     console.log("join room with",roomId)
    //     socket.join(roomId)
    //  })

    //  socket.on("send-message", async (message)=>{
    //     console.log(message)
    //     await axios.post(`${process.env.NEXT_BASE_URL}/api/chat/save`,message)
    //     io.to(message.roomId).emit("send-message",message)
    //  })

  

// JOIN ROOM
socket.on("join-room", (roomId) => {
    if (!roomId) return;
    // Force to string to ensure "694f..." === "694f..."
    const roomStr = String(roomId); 
    socket.join(roomStr);
    console.log(`Socket ${socket.id} joined room: ${roomStr}`);
});

// SEND MESSAGE
socket.on("send-message", async (message) => {
    try {
        const roomStr = String(message.roomId); // Force to string
        console.log("New Message for room:", roomStr, message.text);
        // Save to DB
        const response = await axios.post(`${process.env.NEXT_BASE_URL}/api/chat/save`, message);
        // Use the saved message (it will have the real DB _id now)
        const savedMessage = response.data.message || message;
        // Broadcast to the string-based room
        io.to(roomStr).emit("send-message", savedMessage);

    } catch (error) {
        console.log("Save Message Error:", error.message);
        io.to(String(message.roomId)).emit("send-message", message);
    }
});

     

     socket.on("disconnect",()=>{
        console.log("user dissconected", socket.id);
     })
})

app.post("/notify",(req,res)=>{
   const {event, data, socketId} = req.body
   console.log("Receiving event:", event)
   if (socketId) {
    io.to(socketId).emit(event,data)
   } else {
    io.emit(event,data)
   }
   return res.status(200).json({"success":true})
})

server.listen(port,()=>{
    console.log(`Server is statred at ${port}`);
})
