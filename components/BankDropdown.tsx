"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from "@/components/ui/select";
import { formatAmount } from "@/lib/utils";

export const BankDropdown = ({
    accounts = [],
    setValue,
    selectedValue,
    otherStyles,
  }: {
    accounts: Account[];
    setValue: (value: any) => void;
    selectedValue: Account | null;
    otherStyles?: string;
  }) => {
    const [selected, setSelected] = useState<Account | null>(selectedValue || accounts[0] || null);
  
    const handleBankChange = (id: string) => {
      const account = accounts.find((account) => account.appwriteItemId === id);
      if (account) {
        setSelected(account);
  
        // Update the form state with the selected bank object
        if (setValue) {
          setValue(account); // Pass the entire bank object
        }
      }
      console.log('DROP DOWN CHANGE',account)
    };
  
    return (
      <Select
        value={selected?.appwriteItemId || ""}
        onValueChange={(value) => handleBankChange(value)}
      >
        <SelectTrigger
          className={`flex w-full bg-white gap-3 md:w-[300px] ${otherStyles}`}
        >
          <Image
            src="icons/credit-card.svg"
            width={20}
            height={20}
            alt="account"
          />
          <p className="line-clamp-1 w-full text-left">{selected?.name || "Select a bank"}</p>
        </SelectTrigger>
        <SelectContent
          className={`w-full bg-white md:w-[300px] ${otherStyles}`}
          align="end"
        >
          <SelectGroup>
            <SelectLabel className="py-2 font-normal text-gray-500">
              Select a bank to display
            </SelectLabel>
            {accounts.map((account: Account) => (
              <SelectItem
                key={account.id}
                value={account.appwriteItemId}
                className="cursor-pointer border-t"
              >
                <div className="flex flex-col ">
                  <p className="text-16 font-medium">{account.name}</p>
                  <p className="text-14 font-medium text-blue-600">
                    {formatAmount(account.currentBalance)}
                  </p>
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    );
  };