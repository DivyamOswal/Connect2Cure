import React, { useEffect } from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Home/Hero'

const Home = () => {
   useEffect(()=>{
      window.scrollTo({top:0, behavior:"smooth"})
    },[])
  return (
    <div>
        <Navbar/>
        <Hero/>
    </div>
  )
}

export default Home