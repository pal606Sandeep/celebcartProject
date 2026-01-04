import { getSocket } from '@/lib/socket'
import { IMessage } from '@/models/message.model'
import axios from 'axios'
import { Loader, Send, Sparkle } from 'lucide-react'
import { AnimatePresence } from 'motion/react'
import {motion} from 'motion/react'
import React, { useEffect, useRef, useState } from 'react'

type props={
    orderId:string,
    deliveryBoyId:string
}
function DeliveryChat({orderId, deliveryBoyId}:props) {
    const[newMessage, setNewMessage] = useState("")
    const[messages, setMessages] = useState<IMessage[]>([])
    const scrollRef = useRef<HTMLDivElement>(null);
    const [suggestions, setSuggestions] = useState([])
    const [loading, setLoading] = useState(false)

    // useEffect(()=>{
    //     const socket = getSocket()
    //     socket.emit("join-room",orderId)
    // },[])

    // const sendMsg = ()=>{
    //     const socket = getSocket()
    //     const message = {
    //         roomId:orderId,
    //         text:newMessage,
    //         senderId:deliveryBoyId,
    //         time:new Date().toLocaleTimeString(
    //             [],
    //             {
    //                 hour:"2-digit",
    //                 minute:"2-digit"
    //             }
    //         )
    //     }
    //     socket.emit("send-message",message)
    //     socket.on("send-message",(message)=>{
    //         if (message.roomId===orderId) {
    //             setMessages(prev=>[...prev!,message])
    //         }  
    //     })
    //     setNewMessage("")
    // }

    useEffect(() => {
        // if (!orderId) return;
        const socket = getSocket();
        const roomIdStr = orderId.toString()

        socket.emit("join-room", roomIdStr);
        
        // Join the specific order room
        const handleNewMessage = (incomingMsg: IMessage) => {
            // Log to verify message is arriving in the frontend
            console.log("Real-time message received:", incomingMsg);
    
            if (String(incomingMsg.roomId) === roomIdStr) {
                setMessages((prev) => {

                    // Ensure prev is an array
                const currentMessages = prev || [];
                    // Prevent duplicate messages
                    const exists = currentMessages.some(m => 
                        (m._id && String(m._id) === String(incomingMsg._id)) || 
                        (m.text === incomingMsg.text && m.time === incomingMsg.time)
                    );
                    
                    if (exists) return currentMessages;
                    return [...currentMessages, incomingMsg];
                });
            }
        };
    
        // 3. Listen
        socket.on("send-message", handleNewMessage);
    
        return () => {
            socket.off("send-message", handleNewMessage);
        };
    }, [orderId]);
    
    const sendMsg = () => {
        if (!newMessage.trim()) return; // Don't send empty messages
        const socket = getSocket();
        const message = {
            roomId: orderId.toString(),
            text: newMessage,
            senderId: deliveryBoyId, // use appropriate ID
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        };
        socket.emit("send-message", message);
        setNewMessage("");
    };

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    useEffect(()=>{
        const getAllMessages = async ()=>{
            try {
                const result = await axios.post("/api/chat/messages",{roomId:orderId})
                // console.log(result.data)
                setMessages(result.data)
            } catch (error) {
                console.log(error)
            }
        }
        getAllMessages()
    },[])

    const getSuggestion = async ()=> {
        try {
            setLoading(true)
          const lastMessage = messages?.filter(m=>m.senderId.toString()!==deliveryBoyId).at(-1)
          const result = await axios.post("/api/chat/ai-suggestions", {message:lastMessage?.text, role:"delivery_boy"})
          setSuggestions(result.data)
          setLoading(false)
        } catch (error) {
          console.log(error)
          setLoading(false)
        }
      }

    

  return (
    <div className='bg-white rounded-3xl shadow-lg border p-4 h-[430px] flex flex-col'>


      <div className='flex justify-between items-center mb-3'>
        <span className='font-semibold text-gray-700 text-sm'>Quick Replies</span>
        <motion.button
        onClick={getSuggestion}
        disabled={loading}
        whileTap={{scale:0.9}}
        className='px-3 py-1 text-xs flex items-center gap-1 bg-purple-100 text-purple-700 rounded-full shadow-sm border-purple-200 cursor-pointer'
        ><Sparkle size={14}/>{loading?<Loader className='w-5 h-5 animate-spin'/>:"AI Suggest"}</motion.button>
      </div>

      <div className='flex gap-2 flex-wrap mb-3'>
        {suggestions.map((s,idx)=>(
          <motion.div
          key={idx}
          whileTap={{scale:0.92}}
          className='px-3 py-1 text-xs bg-green-50 border border-green-200 text-green-700 rounded-full cursor-pointer'
          onClick={()=>setNewMessage(s)}
          >
            {s}
          </motion.div>
        ))}
      </div>



      <div 
      ref={scrollRef}
      className='flex-1 overflow-y-auto p-2 space-y-3'>
        <AnimatePresence>
            {messages?.map((msg,idx)=>(
              <motion.div
              key={msg._id?.toString() || `msg-${idx}`}
              initial={{opacity:0,y:15}}
              animate={{opacity:1,y:0}}
              exit={{opacity:0}}
              transition={{duration:0.2}}
              className={`flex ${msg.senderId.toString()==deliveryBoyId?"justify-end":"justify-start"}`}
              >
                <div className={`px-4 py-2 max-w-[75%] rounded-2xl shadow
                ${
                    msg.senderId.toString()==deliveryBoyId
                    ?"bg-green-600 text-white rounded-br-none"
                    :"bg-gray-100 text-gray-800 rounded-bl-none"
                }`}>
                    <p>{msg.text}</p>
                    <p className='text-[10px] opacity-70 mt-1 text-right'>{msg.time}</p>
                </div>

              </motion.div>
            ))}
        </AnimatePresence>
      </div>

        <div className='flex gap-2 mt-3 border-t pt-3'>
            <input 
            value={newMessage}
            onChange={(e)=>setNewMessage(e.target.value)}
            type="text" 
            placeholder='Type a Message'
            className='flex-1 bg-gray-100 px-4 py-2 rounded-xl outline-none focus:ring-2 focus:ring-green-500'
            />
            <button 
            onClick={sendMsg}
            className='bg-green-600 hover:bg-green-700 p-3 rounded-xl text-white'><Send size={18}/></button>
        </div>
    </div>
  )
}

export default DeliveryChat