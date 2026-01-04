'use client'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import AdminOrderCard from '@/components/AdminOrderCard'
import { getSocket } from '@/lib/socket'
import { IUser } from '@/models/user.model'

export interface IOrder{
  _id:string,
  user:string,
  items:[
      {
          grocery:string,
          name:string,
          price:string,
          unit:string,
          image:string,
          quantity:number
      }
  ],
  isPaid:boolean,
  totalAmount:number,
  paymentMethod:"cod" | "online"
  address:{
      fullName:string,
      city:string,
      state:string,
      pincode:string,
      fullAddress:string,
      mobile:string,
      latitude:number,
      longitude:number
  }
  assignment?:string
  assignedDeliveryBoy?:IUser
  status:"pending"|"out of delivery"|"delivered"
  createdAt?:Date,
  updateAt?:Date
}


function ManageOrders() {

    const[orders, setOrders] = useState<IOrder[]>()
    const router = useRouter()

   useEffect(()=>{
    const getOrders = async()=>{
        try {
           const result = await axios.get("/api/admin/get-orders") 
        //    console.log(result);
           setOrders(result.data)
        } catch (error) {
            console.log(error);    
        }
    }
    getOrders()
   },[])

  // useEffect(() => {
  //   const socket = getSocket();
    
  //   socket?.on("new-order", (newOrder: IOrder) => {
  //     // console.log("New order received via Socket:", newOrder);


  //     setOrders((prevOrders) => {
  //        if (!prevOrders) return [newOrder];
  //        return [newOrder, ...prevOrders]; // Put newest order at the top
  //     });
  //   });
  //   return () => {
  //     socket?.off("new-order"); // Always cleanup listeners
  //   };
  // }, []);

  useEffect(() => {
    const socket = getSocket();
    
    socket?.on("new-order", (newOrder: IOrder) => {
      // 1. Force the status to be lowercase "pending" to match your statusOptions exactly
      const formattedOrder = {
        ...newOrder,
        status: "pending" 
      };
  
      setOrders((prevOrders) => {
        if (!prevOrders) return [formattedOrder as any];
        
        // 2. Check if order already exists to prevent duplicates that cause state confusion
        const isDuplicate = prevOrders.some(o => o._id === formattedOrder._id);
        if (isDuplicate) return prevOrders;
  
        return [formattedOrder, ...prevOrders];
      });
    });

    socket.on("order-assigned",({orderId,assignedDeliveryBoy})=>{
      setOrders((prev)=>prev?.map((o)=>(
        o._id==orderId?{...o,assignedDeliveryBoy}:o
       )))
    })
  
    return () => {
      socket?.off("new-order")
      socket?.off("order-assigned")
    };
  }, []);

  return (
    <div className='min-h-screen bg-gray-50 w-full'>
        <div className='fixed top-0 left-0 w-full backdrop-blur-lg bg-white/70 shadow-sm border-b z-50'>
          <div className='max-w-3xl mx-auto flex items-center gap-4 px-4 py-3'>
            <button 
            className='p-2 bg-gray-100 rounded-full hover:bg-gray-200 active:scale-95 transition'
            onClick={()=>router.push("/")}
            >
              <ArrowLeft size={24} className='text-green-700'/>
            </button>
            <h1 className='text-xl font-bold text-gray-800'>Manage Orders</h1>
          </div>
        </div>

        <div className='max-w-6xl mx-auto px-4 pt-15 pb-16 space-y-8'>
        <div className='mt-4 space-y-6'>
           {orders?.map((order,index)=>(
            <AdminOrderCard key={index} order={order}/>
           ))}
          </div>
        </div>
    </div>
  )
}

export default ManageOrders