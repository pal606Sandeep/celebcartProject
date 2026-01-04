import React, { useEffect } from 'react'

interface Ilocation{
    latitude:number
    longitude:number
  }

interface Iprops{
    userLocation:Ilocation
    deliveryBoyLocation:Ilocation
}

import L, { LatLngExpression } from "leaflet"
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from 'react-leaflet'
import "leaflet/dist/leaflet.css"

function Recenter({positions}:{positions:[number,number]}){
  const map = useMap()
  useEffect(()=>{
    if (positions[0]!==0 && positions[1]!==0) {
      map.setView(positions,map.getZoom(),{
        animate:true
      })
    }
  },[positions, map])
  
  return null
}



function LiveMap({userLocation,deliveryBoyLocation}:Iprops) {

  const delivertBoyIcon = L.icon({
    iconUrl:"https://cdn-icons-png.flaticon.com/128/9561/9561688.png",
    iconSize:[45,45]
  })
  const userIcon = L.icon({
    iconUrl:"https://cdn-icons-png.flaticon.com/128/4821/4821951.png",
    iconSize:[45,45]
  })
  
  const center =[userLocation.latitude,userLocation.longitude]
  const linePositions = deliveryBoyLocation && userLocation?[
    [userLocation.latitude,userLocation.longitude],
    [deliveryBoyLocation.latitude,deliveryBoyLocation.longitude]
  ]:[]

  return (
    <div className='w-full h-[500px] rounded-xl overflow-hidden shadow relative z-0'>
      {/* <Recenter positions={center as any}/> */}
       <MapContainer 
       center={center as LatLngExpression} 
       zoom={13} scrollWheelZoom={true} className='w-full h-full'>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker 
          position={[userLocation.latitude,userLocation.longitude]}
          icon={userIcon}
          >
            <Popup>delivery Address</Popup>
          </Marker>

          {deliveryBoyLocation && 
            <Marker
            position={[deliveryBoyLocation.latitude,deliveryBoyLocation.longitude]}
          icon={delivertBoyIcon}
            >
              <Popup>delivery Boy</Popup>
            </Marker>
          }
          <Polyline positions={linePositions as any} color='green'></Polyline>
        </MapContainer>
    </div>
  )
}

export default LiveMap