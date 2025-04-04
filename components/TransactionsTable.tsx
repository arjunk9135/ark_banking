import React from 'react';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { formatAmount, formatDateTime, getTransactionStatus, removeSpecialCharacters } from '@/lib/utils';

const TransactionsTable = ({transactions}:TransactionTableProps) => {
  return (
    <Table>
  <TableHeader className='bg-[#f9fafb]'>
    <TableRow >
      <TableHead className="px-2">Transaction</TableHead>
      <TableHead className="px-2">Amount</TableHead>
      <TableHead className="px-2">Status</TableHead>
      <TableHead className="px-2">Date To</TableHead>
      <TableHead className="px-2 max-md:hidden">Channel</TableHead>
      <TableHead className="px-2 max-md:hidden">Category</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {transactions?.map((t:Transaction)=>{
         const status = getTransactionStatus(new Date(t?.date));
         const amount = formatAmount(t?.amount);
         const isDebit = t?.type === 'debit';
         const isCredit = t?.type === 'credit';
         return (
            <TableRow key={t?.id} className={`${isDebit || amount[0] === '-' ? 'bg-[#FFFBFA]' : 'bg-[#F6FEF9]'} !over:bg-none !border-b-DEFAULT`}>
                <TableCell className='max-w-[250px] pl-2 pr-10'>
                    <div className='flex items-center gap-3'>
                        <h1 className='text-14 truncate font-semibold text-[#344054]'>
                            {removeSpecialCharacters(t?.name)}
                        </h1>
                    </div>
                </TableCell>
                <TableCell>
                    <div>
                        <h1>
                            {isDebit ? `-${amount}` : isCredit ?  `+${amount}` : amount}
                        </h1>
                    </div>
                </TableCell>
                <TableCell>
                    {status}
                </TableCell>
                <TableCell>
                    {formatDateTime(new Date(t?.date)).dateTime}
                </TableCell>
                <TableCell>
                    {t?.paymentChannel}
                </TableCell>
                <TableCell>
                    {t?.category}
                </TableCell>

            </TableRow>
         ) 
})}
  </TableBody>
</Table>

  )
}

export default TransactionsTable