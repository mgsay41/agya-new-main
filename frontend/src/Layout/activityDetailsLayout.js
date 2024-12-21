import React from 'react'
import Navbar from '../components/Navbar'
import { Outlet } from 'react-router-dom'

function ActivityDetailsLayout() {
  return (
    <div className=" px-[150px]">
    <Navbar/>
    <div className=" flex  my-10 ">
            <div  className="flex-grow w-3/5">
            <Outlet />
            </div>
    </div>
</div>
  )
}
export default ActivityDetailsLayout;