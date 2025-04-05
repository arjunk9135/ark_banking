import HeaderBox from '@/components/HeaderBox'
import RecentTransactions from '@/components/RecentTransactions'
import RightSidebar from '@/components/RightSidebar'
import TotalBalanceBox from '@/components/TotalBalanceBox'
import { getAccount, getAccounts } from '@/lib/actions/bank.actions'
import { getLoggedInUser } from '@/lib/actions/user.actions'
import React from 'react'

const Home = async ({ searchParams: { id, page } }: SearchParamProps) => {
    const _id = id ? String(id) :  undefined;
    const currentPage = Number(page) || 1;

    const loggedIn = await getLoggedInUser();
    const accounts = loggedIn?.$id ? await getAccounts({ userId: loggedIn?.$id }) : []

    if (!accounts) {
        return;
    }

    const accountsData = accounts?.data
    const appwriteItemId =  String(loggedIn?.$id) ||  accountsData?.[0]?.appwriteItemId;

    const account = await getAccount({ appwriteItemId  });

    console.log('Accounts Data.',accounts)

    return (
        <section className='home'>
            <div className='home-content'>
                <header className='home-header'>
                    <HeaderBox
                        type="greeting"
                        title='Welcome'
                        user={`${loggedIn?.firstName}`}
                        subtext='Access and manage your account and transactions efficiently'
                    />
                    <TotalBalanceBox
                        accounts={accountsData}
                        totalBanks={accounts?.totalBanks}
                        totalCurrentBalance={accounts?.totalCurrentBalance}



                    />

                    <RecentTransactions
                    accounts={accounts}
                    transactions={account?.transactions}
                    appwriteItemId={appwriteItemId}
                    page={currentPage}
                    />
                </header>


            </div>
            <RightSidebar user={loggedIn} transactions={accounts?.transactions} banks={accountsData?.slice(0, 2)} />
        </section>
    )
}

export default Home