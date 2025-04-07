import HeaderBox from '@/components/HeaderBox'
import PaymentTransferForm from '@/components/PaymentTransferForm'
import { getAccounts } from '@/lib/actions/bank.actions';
import { getLoggedInUser } from '@/lib/actions/user.actions';
import React from 'react'

const Transfer = async() => {

   const loggedIn = await getLoggedInUser();
      const accounts = loggedIn?.$id ? await getAccounts({ userId: loggedIn?.$id }) : []


      if (!accounts) {
        return;
    }

    const accountsData = accounts?.data

  return (
    <section className='payment-transfer'>
      <HeaderBox
      title='Payments & Transfers'
      subtext='Please provide any specific details or notes related to this payment or transfer'
      />
      <section className='size-full pt-5'>
        <PaymentTransferForm accounts={accountsData} />
      </section>
    </section>
  )
}

export default Transfer