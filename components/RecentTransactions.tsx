'use client';
import Link from 'next/link'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BankTabItem } from './BankTabItem'
import BankInfo from './BankInfo'
import TransactionsTable from './TransactionsTable'
import { useState } from 'react';
// import { Pagination } from './Pagination'

const RecentTransactions = ({
  accounts,
  transactions = [],
  appwriteItemId,
  page = 1,
}: any) => {

  const rowsPerPage = 10;
  const totalPages = Math.ceil(transactions.length / rowsPerPage);

  const indexOfLastTransaction = page * rowsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - rowsPerPage;

  const currentTransactions = transactions.slice(
    indexOfFirstTransaction, indexOfLastTransaction
  )

  const [activeTab, setActiveTab] = useState(accounts?.data?.[0]?.appwriteItemId);
  const [accountsData,setAccountsData] = useState(accounts?.data);
  const [activeTransactions, setActiveTransactions] = useState(currentTransactions);


  
   const handleTabChange = (item:any) => {
    const newActiveAccount = accountsData?.filter((i:any)=>i?.appwriteItemId === item);
    const filteredTransactions = newActiveAccount?.[0]?.transactions?.slice(
      indexOfFirstTransaction,  indexOfLastTransaction);
   setActiveTransactions(filteredTransactions);
   setActiveTab(item);
  }
  

  return (
    <section className="recent-transactions">
      <header className="flex items-center justify-between">
        <h2 className="recent-transactions-label">Recent transactions</h2>
        <Link
          href={`/transaction-history/?id=${activeTab}`}
          className="view-all-btn"
        >
          View all
        </Link>
      </header>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="recent-transactions-tablist flex border-b border-gray-200">
          {accountsData?.map((account: any) => (
            <TabsTrigger
              key={account.id}
              value={account.appwriteItemId}
              className={`px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 focus:outline-none ${
                activeTab === account.appwriteItemId
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : ''
              }`}
            >
              {account.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {accountsData.map((account: any) => (
          <TabsContent
            value={account.appwriteItemId}
            key={account.id}
            className="space-y-4"
          >
            <BankInfo 
              account={account}
              appwriteItemId={appwriteItemId}
              type="full"
            />

            <TransactionsTable transactions={activeTransactions} />
            

            {totalPages > 1 && (
              <div className="my-4 w-full">
                {/* <Pagination totalPages={totalPages} page={page} /> */}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </section>
  )
}

export default RecentTransactions