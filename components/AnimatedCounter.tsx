'use client';

import React from 'react';
import CountUp from 'react-countup';

const AnimatedCounter = ({amount}:{amount:number}) => {
  return (
    <div className='w-full'>
        <CountUp end={amount} prefix='$' decimal=',' />
    </div>
  )
}

export default AnimatedCounter