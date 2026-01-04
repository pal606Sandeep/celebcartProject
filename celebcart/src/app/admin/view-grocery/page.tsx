'use client'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import {AnimatePresence, motion} from "motion/react"
import { ArrowLeft, Loader, Package, Pencil, Search, Upload, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { IGrocery } from '@/models/grocery.model'
import Image from 'next/image'

const categories = [
    "Fruits & Vegetables",
    "Dairy & Eggs",
    "Snacks & Biscuits",
    "Spices & Masalas",
    "Beverages & Drinks",
    "Personal Care",
    "Household Essentials",
    "Instant & Packaged Food",
    "Baby & Pet Care"
]

const units = [
    "kg", "g", "liter", "ml", "piece","pack"
  ]

function ViewGrocery() {
  const router = useRouter()

  const[groceries, setGroceries] = useState<IGrocery[]>()
  const[search, setSearch] = useState("")
  const[editing, setEditing] = useState<IGrocery | null>(null)
  const[imagePreview, setImagePreview] = useState<string | null>(null)
  const[backendImage, setBackendImage] = useState<Blob | null>(null)
  const[loading, setLoading] = useState(false)
  const[deleteLoading, setDeleteLoading] = useState(false)
  const[filltered, setFilltered] = useState<IGrocery[]>()


  useEffect(()=>{
    const getGroceries = async ()=>{
      try {
        const result = await axios.get("/api/admin/get-groceries")
       setGroceries(result.data)
       setFilltered(result.data)
      } catch (error) {
        console.log(error)
      }
    }
    getGroceries()
  },[])

  useEffect(()=>{
   if (editing) {
    setImagePreview(editing.image)
   }
  },[editing])

  const handelImageUpload = (e:React.ChangeEvent<HTMLInputElement>)=>{
   const file = e.target.files?.[0]
   if (file) {
    setBackendImage(file)
    setImagePreview(URL.createObjectURL(file))
   }
  }

  const handelEdit = async ()=>{
    setLoading(true)
    if (!editing) return
    try {
        const formData =new FormData()
        formData.append("groceryId",editing._id.toString())
        formData.append("name",editing.name)
        formData.append("category",editing.category)
        formData.append("price",editing.price)
        formData.append("unit",editing.unit)
    if (backendImage) {
      formData.append("image",backendImage)
    }
        const result = await axios.post("/api/admin/edit-grocery", formData)
        // console.log(result)
        setLoading(false)
        window.location.reload()
    } catch (error) {
        console.log(error)
        setLoading(false)
    }
  }

  const handelDelete = async ()=>{
    setDeleteLoading(true)
    if (!editing) return
    try {
        const result = await axios.post("/api/admin/delete-grocery", {groceryId:editing._id})
        // console.log(result)
        setDeleteLoading(false)
        window.location.reload()
    } catch (error) {
        console.log(error)
        setDeleteLoading(false)
    }
  }

  const handelSearch = (e:React.FormEvent)=>{
    e.preventDefault()
    const q = search.toLowerCase()

    setFilltered(
      groceries?.filter(
        (g)=>g.name.toLowerCase().includes(q) || g.category.toLowerCase().includes(q)
      )
    )
  }
  return (
    <div className='pt-4 w-[95%] md:w-[85%] mx-auto pb-20'>
      <motion.div
      initial={{opacity:0, x:-20}}
      animate={{opacity:1, x:0}}
      transition={{duration:0.4}}
      className='flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 text-center sm:text-left'
      >
        <button
        onClick={()=>router.push("/")}
        className='flex items-center justify-center gap-2 bg-green-100 hover:bg-green-200 text-green-700 font-semibold px-4 py-2 rounded-full transition w-full sm:w-auto'
        >
          <ArrowLeft size={18}/>
          <span>Back</span>
        </button>
        <h1 className='text-2xl md:text-3xl font-extrabold text-green-700 flex items-center justify-center gap-2'><Package size={28} className='text-green-600'/>Manage Groceries</h1>
      </motion.div>

      <motion.form
      initial={{opacity:0, y:-10}}
      animate={{opacity:1, x:0}}
      transition={{duration:0.4}}
      onSubmit={handelSearch}
      className='flex items-center bg-white border border-gray-200 rounded-full px-5 py-3 shadow-sm mb-10 hover:shadow-lg transition-all max-w-lg mx-auto w-full'
      >
        <Search className='text-gray-500 w-5 h-5 mr-2'/>
        <input 
        onChange={(e)=>setSearch(e.target.value)}
        value={search}
        className='w-full outline-none text-gray-700 placeholder-gray-400'
        placeholder='Search by name or category....'
        type="text" />
      </motion.form>

     <div className='space-y-4'>
     {filltered?.map((g,i)=>(
         <motion.div
         key={i}
         whileHover={{scale:1.01}}
         transition={{type:"spring", stiffness:100}}
         className='bg-white rounded-2xl shadow-md hover:shadow-xl border border-gay-100 flex flex-col sm:flex-row items-center sm:items-start gap-5 p-5 transition-all'
         >
            <div className='relative w-full sm:w-44 aspect-square rounded-xl overflow-hidden border-gray-200'>
                <Image src={g.image} alt={g.name} fill className='object-cover hover:scale-110 transition-transform duration-500'/>
            </div>

            <div className='flex-1 flex flex-col justify-between w-full'>
                <div>
                    <h3 className='font-semibold text-gray-800 text-lg truncate'>{g.name}</h3>
                    <p className='text-gray-500 text-sm capitalize'>{g.category}</p>
                </div>
                <div className='mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2'>
                    <p className='text-green-700 font-bold text-lg'>₹{g.price}/ <span className='text-gray-500 text-sm font-medium ml-1'>{g.unit}</span></p>
                    <button
                    onClick={()=>setEditing(g)}
                    className='bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:bg-green-700 transition-all'
                    ><Pencil size={15}/>Edit</button>
                </div>
            </div>
         </motion.div>
     ))}
     </div>

     {/* <AnimatePresence>
        {editing && (
            <motion.div
            initial={{opacity:0}}
            animate={{opacity:1}}
            exit={{opacity:0}}
            className='fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm px-4'
            >
                <motion.div
                initial={{y:40, opacity:0}}
                animate={{y:0, opacity:1}}
                exit={{y:40, opacity:0}}
                transition={{duration:0.3}}
                className='bg-white rounded-2xl shadow-2xl w-full max-w-md p-7 relative'
                >
                    <div className='flex justify-between    items-center mb-4'>
                      <h2 className='text-2xl font-bold text-green-700'>Edit Grocery</h2>
                      <button
                      onClick={()=>setEditing(null)}
                      className='text-gray-600 hover:text-red-600'
                      >
                        <X size={18}/>
                      </button>
                    </div>

                    <div className='relative aspect-square w-full rounded-lg overflow-hidden mb-4 border border-gray-200 group'>
                        {imagePreview && 
                        <Image 
                        src={imagePreview}
                        alt={editing.name}
                        fill
                        className='object-cover'
                        />}
                        <label htmlFor="imageUpload"><Upload/></label>
                        <input type="file" accept='image/*' hidden id='imageUpload'/>
                    </div>

                    <div className='space-y-4'>
                        <input 
                        onChange={(e)=>setEditing({...editing, name:e.target.value})}
                        className='w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 outline-none'
                        placeholder='Enter Grocery Name'
                        value={editing.name}
                        type="text" 
                        />

                        <select 
                        onChange={(e)=>setEditing({...editing,category:e.target.value})}
                        value={editing.category}
                        className='w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 outline-none bg-white'>
                          {categories.map((c,i)=>(
                            <option key={i}
                            value={c}
                            >
                                {c}
                            </option>
                          ))}
                        </select>

                        <input 
                        onChange={(e)=>setEditing({...editing, price:e.target.value})}
                        className='w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 outline-none'
                        placeholder='0000'
                        value={editing.price}
                        type="text" 
                        />

                        <select 
                        onChange={(e)=>setEditing({...editing,unit:e.target.value})}
                        value={editing.unit}
                        className='w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 outline-none bg-white'>
                          {units.map((c,i)=>(
                            <option key={i}
                            value={c}
                            >
                                {c}
                            </option>
                          ))}
                        </select>
                    </div>

                    <div className='flex justify-end gap-3 mt-6'>
                     <button className='px-2 py-2 rounded-lg bg-green-600 text-white flex items-center gap-2 hover:bg-green-700 transition-all'>
                        Edit Grocery
                     </button>

                     <button className='px-4 py-2 rounded-lg bg-red-600 text-white flex items-center gap-2 hover:bg-red-700 transition'>
                        Delete Grocery    
                     </button>
                    </div>
                </motion.div>


            </motion.div>
        )}
     </AnimatePresence> */}

<AnimatePresence>
  {editing && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      // Use "items-start" and "py-10" to ensure there is room at top/bottom when scrolling
      className='fixed inset-0 bg-black/40 flex items-start justify-center z-50 backdrop-blur-sm px-4 overflow-y-auto py-10'
    >
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ duration: 0.3 }}
        // Added "max-h-full" and "overflow-hidden" to keep everything inside the card
        className='bg-white rounded-2xl shadow-2xl w-full max-w-md p-7 relative flex flex-col'
      >
        {/* Sticky-like Header */}
        <div className='flex justify-between items-center mb-4 shrink-0'>
          <h2 className='text-2xl font-bold text-green-700'>Edit Grocery</h2>
          <button
            onClick={() => setEditing(null)}
            className='text-gray-600 hover:text-red-600 p-1'
          >
            <X size={20}/>
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className='overflow-y-auto pr-1 custom-scrollbar'>
          <div className='relative aspect-square w-full rounded-lg overflow-hidden mb-4 border border-gray-200 group'>
            {imagePreview && 
              <Image 
                src={imagePreview}
                alt={editing.name}
                fill
                className='object-cover'
              />
            }
            {/* Image Overlay Label */}
            <label 
              htmlFor="imageUpload" 
              className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-md cursor-pointer hover:bg-gray-100 transition-colors"
            >
              <Upload size={18} className="text-green-700"/>
            </label>
            <input type="file" accept='image/*' hidden id='imageUpload' onChange={handelImageUpload}/>
          </div>

          <div className='space-y-4 pb-2'>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 ml-1">Grocery Name</label>
              <input 
                onChange={(e)=>setEditing({...editing, name:e.target.value})}
                className='w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 outline-none'
                placeholder='Enter Grocery Name'
                value={editing.name}
                type="text" 
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 ml-1">Category</label>
              <select 
                onChange={(e)=>setEditing({...editing,category:e.target.value})}
                value={editing.category}
                className='w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 outline-none bg-white'
              >
                {categories.map((c,i)=>(
                  <option key={i} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-4">
              <div className="flex-1 space-y-1">
                <label className="text-xs font-semibold text-gray-500 ml-1">Price (₹)</label>
                <input 
                  onChange={(e)=>setEditing({...editing, price:e.target.value})}
                  className='w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 outline-none'
                  placeholder='0000'
                  value={editing.price}
                  type="text" 
                />
              </div>

              <div className="flex-1 space-y-1">
                <label className="text-xs font-semibold text-gray-500 ml-1">Unit</label>
                <select 
                  onChange={(e)=>setEditing({...editing,unit:e.target.value})}
                  value={editing.unit}
                  className='w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 outline-none bg-white'
                >
                  {units.map((u,i)=>(
                    <option key={i} value={u}>{u}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className='flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100 shrink-0'>
          <button 
          onClick={handelEdit}
          disabled={loading}
          className='px-4 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-all'>
            {loading?<Loader size={14}/>:"Edit Grocery"}
          </button>
          <button 
          onClick={handelDelete}
          disabled={deleteLoading}
          className='px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-all'>
             {deleteLoading?<Loader size={14}/>:"Delete Grocery"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>


    </div>
  )
}

export default ViewGrocery