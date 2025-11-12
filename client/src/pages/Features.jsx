import React, { useEffect } from 'react'
import FeaturesPage from '../components/Features/FeaturePage'

const Features = () => {
     useEffect(()=>{
      window.scrollTo({top:0, behavior:"smooth"})
    },[])
  return (
    <div>
        <FeaturesPage/>
    </div>
  )
}

export default Features