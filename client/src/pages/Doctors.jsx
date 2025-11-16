import React, { useEffect } from 'react'
import Title from '../components/Title'
import AllDoctors from '../components/Doctors/AllDoctors'

const Doctors = () => {
     useEffect(()=>{
               window.scrollTo({top:0, behavior:"smooth"})
             },[])
  return (
    <div className='bg-[#E6E6E6] px-6 py-5 md:px-16 lg:px-24 xl:px-32 overflow-hidden'>
        <Title title='Find the Right Doctor for Your Healthcare Needs' subtitle='Explore qualified specialists across multiple medical fields. Compare expertise, experience, fees, and availability to choose the best doctor for your treatment.'/>
        <AllDoctors/>
    </div>
  )
}

export default Doctors