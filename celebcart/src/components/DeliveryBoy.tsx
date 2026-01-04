import React from 'react'
import DeliveryBoyDashboard from './DeliveryBoyDashboard'
import { auth } from '@/auth'
import { ConnectDB } from '@/lib/db'
import { Order } from '@/models/order.model'

async function DeliveryBoy() {
  await ConnectDB()
  const session = await auth()
  const deliveryBoyId = session?.user?.id
  const orders = await Order.find({
    assignedDeliveryBoy:deliveryBoyId,
    deliveryOtpVerification:true
  })

  const today = new Date().toDateString()
  const todaysOrders = orders.filter((o)=>(o.deliveredAt).toDateString()===today).length
  const todaysEarning = todaysOrders*50
  return (
    <>
    <DeliveryBoyDashboard earning={todaysEarning}/>
    </>
  )
}

export default DeliveryBoy