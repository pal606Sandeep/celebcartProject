'use client'
import { Leaf, ShoppingBasket, Smartphone, Truck } from 'lucide-react'
import { AnimatePresence } from 'motion/react'
import {motion} from "motion/react"
import { button } from 'motion/react-client'
import Image from "next/image"
import React, { useEffect, useState } from 'react'
import {getSocket} from "@/lib/socket"
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'

function HeroSection() {
  // const {userData} = useSelector((state:RootState)=>state.user)
  // useEffect(()=>{
  //  if (userData) {
  //   let socket = getSocket()
  //   socket.emit("identity", userData?._id)
  //  }
  // },[userData])
  // useEffect(() => {
  //   if (userData?._id) {
  //     const socket = getSocket();
      
  //     // Ensure we emit ONLY when the socket is connected
  //     socket.on("connect", () => {
  //       console.log("Socket connected client-side:", socket.id);
  //       socket.emit("identity", userData?._id);
  //     });
  
  //     // If already connected, emit immediately
  //     if (socket.connected) {
  //       socket.emit("identity", userData._id);
  //     }
  
  //     return () => {
  //       socket.off("connect");
  //     };
  //   }
  // }, [userData]);

 const slides =[
  {
   id:1,
   icon:<Leaf className='w-20 h-20 sm:w-28 sm:h-28 text-green-400 drop-shadow-lg'/>,
   titel:"Fresh Organic Groceries 🥬",
   subtitel:"Farm-fresh fruits, vegitables, and daily essentials delivery to you.",
   btnText:"Shop Now",
   bg:"https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8M2QlMjBncmFwaGljcyUyMEZyZXNoJTIwT3JnYW5pYyUyMEdyb2Nlcmllc3xlbnwwfHwwfHx8MA%3D%3D"
  },
  {
   id:2,
   icon:<Truck className='w-20 h-20 sm:w-28 sm:h-28 text-yellow-400 drop-shadow-lg'/>,
   titel:"Fast & Reliable Delivery 🚚",
   subtitel:"We ensure your groceries reach your doorstep in no time.",
   btnText:"Order Now",
   bg:"https://images.unsplash.com/photo-1646052636667-727e095148d6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8M2QlMjBncmFwaGljcyUyMGZvb2QlMjBkZWxpdmVyeSUyMHZhbnxlbnwwfHwwfHx8MA%3D%3D"
  },
  {
   id:3,
   icon:<Smartphone className='w-20 h-20 sm:w-28 sm:h-28 text-blue-400 drop-shadow-lg'/>,
   titel:"Shop Anytime, Anywhere 📱",
   subtitel:"Easy and seamless online grocery shopping experience.",
   btnText:"Get Started",
   bg:"https://images.unsplash.com/photo-1706759755964-b0aa57a58c5a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8M2QlMjBncmFwaGljcyUyMG9ubGluZSUyMGZvb2QlMjBvcmRlciUyMG9uJTIwbW9iaWxlfGVufDB8fDB8fHww"
  }
 ]

 const [current, setCurrent] = useState(0)
 useEffect(()=>{
    const timer = setInterval(()=>{
      setCurrent((prev)=>(prev+1)%(slides.length))
    },2000)
    return ()=>clearInterval(timer)
 },[])

return (
 <div className='relative w-[98%] mx-auto mt-32 h-[80vh] rounded-3xl overflow-hidden shadow-2xl'>
   <AnimatePresence mode='wait'>
     <motion.div
     key={current}
     initial={{opacity:0}}
     animate={{opacity:1}}
     transition={{duration:0.5}}
     exit={{opacity:0}}
     className='absolute inset-0'
     >
      <Image 
      src={slides[current]?.bg}
      fill
      alt='slides'
      priority
      className='object-cover'
      />
      <div className='absolute insert-0 bg-black/50 backdrop-blur-[1px]'/>
     </motion.div>
   </AnimatePresence>

   <div className='absolute inset-0 flex items-center justify-center text-center text-white px-6'>
     <motion.div
     initial={{opacity:0, y:30}}
     animate={{opacity:1, y:0}}
     transition={{duration:0.5}}
     className='flex flex-col items-center justify-center gap-6 max-w-3xl'
     >
     <div className='bg-white/10 backdrop-blur-md p-6 rounded-full shadow-lg'>
        {slides[current].icon}
     </div>
     <h1 className='text-3xl sm:text-5xl md:tsxt-6xl font-extrabold tracking-tight drop-shadow-lg'>{slides[current].titel}</h1>
     <p className='text-lg sm:text-xl text-gray-200 max-w-2xl'>{slides[current].subtitel}</p>

     <motion.button 
      whileHover={{scale:1.09}}
      whileTap={{scale:0.96}}
      transition={{duration:0.2}}
      className='mt-4 bg-white text-green-700 hover:bg-green-300 px-8 py-3 rounded-full font-semibold shadow-lg transition-all duration-300 flex items-center gap-2'
      >
      <ShoppingBasket className='w-5 h-5'/>
      {slides[current].btnText}
     </motion.button>

     </motion.div>
   </div>

   <div className='absolute bottom-6 left-1/2 -transition-x-1/2 flex gap-3'>
    {slides.map((_,index)=>(
        <button 
        key={index}
        className={`w-3 h-3 rounded-full transition-all ${index===current?"bg-white w-6":"bg-white/50"}`}
        />
    ))}
   </div>
 </div>
)
}

export default HeroSection