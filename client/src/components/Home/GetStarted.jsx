import React from 'react'
import { Link } from 'react-router-dom'

const GetStarted = () => {
  return (
    <div className='flex items-center justify-center flex-col gap-4 bg-[#E6E6E6] pt-4 pb-5 '>
        <h1 className='font-semibold lg:text-xl '>Seamless healthcare management for doctors & patients.</h1>
        <Link to='/login'>
        <button className='border px-6 py-2 rounded hover:border-[#FF8040] hover:bg-white transition-colors'>Get Started</button>
        </Link>
    </div>
  )
}

export default GetStarted