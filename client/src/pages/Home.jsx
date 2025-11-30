import React, { useEffect } from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Home/Hero'
import HomeFeatures from '../components/Home/HomeFeatures'
import AboutSystem from '../components/Home/AboutSytem'
import Dashboard from '../components/Home/Dashboard'
import Benefits from '../components/Home/Benefits'
import Doctors from '../components/Home/Doctors'
import GetStarted from '../components/Home/GetStarted'

const Home = () => {
   useEffect(()=>{
      window.scrollTo({top:0, behavior:"smooth"})
    },[])
  return (
    <div>
        <Navbar/>
        <Hero/>
        <HomeFeatures/>
        <Doctors/>
        <AboutSystem/>
        <Dashboard/>
        <Benefits/>
        <GetStarted/>
    </div>
  )
}

export default Home