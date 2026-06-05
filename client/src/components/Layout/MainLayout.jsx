import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../Navbar'

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-violet-50 dark:bg-slate-950 transition-colors duration-300">
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default MainLayout