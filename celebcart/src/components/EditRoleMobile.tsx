'use client'
import React, { useEffect, useState } from 'react'
import {motion} from 'motion/react'
import { ArrowRight, Bike, User, UserCog } from 'lucide-react'
import axios from 'axios'
import { redirect, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'


function EditRoleMobile() {
 const[roles,setRoles] = useState([
    {id:"user", label:"User",icon:User},
    {id:"admin", label:"Admin", icon:UserCog},
    {id:"deliveryBoy", label:"Delivery Boy", icon:Bike}
 ])

 const[selectedRole,setSelectedRole] = useState("")
 const[mobileno, setMobileno] = useState("")
 const {update} = useSession()
 const router = useRouter()

 const handelEdit = async ()=>{
    try {
      const result = await axios.post("/api/user/edit-role-mobile",{
        role:selectedRole,
        mobileno
      })
      await update({role:selectedRole})
      router.push("/")
      
    //   console.log(result.data);
    } catch (error) {
        console.log(error);
        
    }
 }

 useEffect(()=>{
  const checkForAdmin = async ()=>{
    try {
      const result = await axios.get("/api/check-for-admin")
      if (result.data.adminExist) {
        setRoles(prev=>prev.filter(r=>r.id!="admin"))
      }
      
    } catch (error) {
      console.error(error)
    }
   }
   checkForAdmin()
 },[])

 return (
  <div className='flex flex-col min-h-screen p-6 w-full items-center  bg-linear-to-b from-green-100 to-white'>
    <motion.h1
    initial={{opacity:0, y:-30}}
    animate={{opacity:1, y:0}}
    transition={{duration:0.6}}
    className='text-3xl md:text-4xl font-extrabold text-green-700  text-center mt-8 '
    >
        Select your Role
    </motion.h1>

    <div className='flex flex-col md:flex-row justify-center gap-6 mt-10'>
    {roles.map((role,idx)=>{
      const Icon = role.icon
      const isSelected = selectedRole ==role.id
        return (
         <motion.div
         key={idx}
         whileTap={{scale:0.6}}
         onClick={()=>setSelectedRole(role.id)}
         className={`flex flex-col items-center justify-center w-48 h-44 rounded-2xl border-2 transition-all 
         ${
            isSelected
            ?"border-green-600 bg-green-100 shadow-lg"
            :"border-gray-300 bg-white hover:border-green-400"
         }`}
         >
           <Icon/>
           <span>{role.label}</span>
         </motion.div>
        )
    })}
    </div>

   <motion.div
   initial={{opacity:0}}
   animate={{opacity:1}}
   transition={{duration:0.6, delay:0.5}}
   className='flex flex-col items-center mt-10'
   >
    <label htmlFor="mobile"
    className='text-gray-700 font-medium mb-2 text-xl'>
        Enter Your Mobile No.
    </label>
    <input 
    type="tel" 
    id="mobile" 
    placeholder='eg. 0000000000'
    className='w-64 md:w-80 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none text-gray-800'
    onChange={(e)=>setMobileno(e.target.value)}/>
   </motion.div>

   <motion.button
   initial={{opacity:0, y:30}}
   animate={{opacity:1, y:0}}
   transition={{delay:0.7}}
   disabled={mobileno.length!==10 || !selectedRole}
   className={`inline-flex items-center gap-2 font-semibold py-4 px-7 rounded-2xl shadow-md transition-all duration-200 mt-5 
   ${
    selectedRole && mobileno.length ===10
    ?"bg-green-400 hover:bg-green-700 text-white"
    :"bg-gray-300 text-gray-500 cursor-not-allowed"
   }`}
   onClick={handelEdit}
   >
    Go to Home
    <ArrowRight/>
   </motion.button>
  </div>
  )
}

export default EditRoleMobile