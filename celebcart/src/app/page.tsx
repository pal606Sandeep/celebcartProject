
import { auth } from '@/auth'
import AdminDashboard from '@/components/AdminDashboard'
import DeliveryBoy from '@/components/DeliveryBoy'
import EditRoleMobile from '@/components/EditRoleMobile'
import Footer from '@/components/Footer'
import GeoUpdate from '@/components/GeoUpdate'
import Nav from '@/components/Nav'
import UserDashboard from '@/components/UserDashboard'
import { ConnectDB } from '@/lib/db'
import Grocery, { IGrocery } from '@/models/grocery.model'
import User from '@/models/user.model'
import { redirect } from 'next/navigation'
import React from 'react'

async function Home(props:{
  searchParams:Promise<{
    q:string
  }>
}) {

  const searchParams = await props.searchParams
  

  await ConnectDB()
  const session = await auth()
  //  console.log(session);
  
  const user = await User.findById(session?.user?.id)
  if (!user) {
    redirect("/signin")
  }if (!user.mobileno || !user.role ||(!user.mobileno && user.role=="user")) {
    // const inComplete = !user.mobileno || !user.role ||(!user.mobileno && user.role=="user")
    
    return <EditRoleMobile/>
  }

  const plainuser = JSON.parse(JSON.stringify(user))
console.log(plainuser);
console.log(user)

let groceryList:IGrocery[] = []
if(user.role==="user"){
  if (searchParams.q) {
    groceryList = await Grocery.find({
     $or:[
      {name:{$regex: searchParams?.q || "", $options: "i"}},
      {category: {$regex: searchParams?.q || "", $options: "i"}}
     ]
    })
  } else {
     groceryList = await Grocery.find({})
  }
}

  return (
    <div>
      <Nav user={plainuser}/>
      <GeoUpdate userId={plainuser._id}/>
      {user.role=="user"?(<UserDashboard groceryList={groceryList}/>)
       :user.role=="admin"?(<AdminDashboard/>)
       :<DeliveryBoy/>
      }
      <Footer/>
    </div>
  )
  }

export default Home