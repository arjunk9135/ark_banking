import HeaderBox from '@/components/HeaderBox'
import RightSidebar from '@/components/RightSidebar'
import TotalBalanceBox from '@/components/TotalBalanceBox'
import React from 'react'

const Home = () => {

const loggedIn={firstName:"Arjun",lastName:'K',email:'arjunk9135@gmail.com'}

    return (
        <section className='home'>
            <div className='home-content'>
                <header className='home-header'>
                    <HeaderBox 
                    type="greeting" 
                    title='Welcome'
                    user={loggedIn?.firstName || "Guest"} 
                    subtext='Access and manage your account and transactions efficiently'
                    />
                    <TotalBalanceBox
                    accounts={[]}
                    totalBanks={1}
                    totalCurrentBalance={22398.35}
                    
                    
                    /> 
                </header>

                
            </div>
            <RightSidebar user={loggedIn} transactions={[]} banks={[{currentBalance:350.00},{currentBalance:2459.87}]}/>
        </section>
    )
}

export default Home