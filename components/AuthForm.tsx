'use client';
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"


import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import FormFieldItem from './FormFieldItem';
import { authFormSchema } from '@/lib/utils';
import { Loader2 } from 'lucide-react';



const AuthForm = ({ type }: { type: String }) => {

    const [user, setuser] = React.useState(null);
    const [loading, setloading] = React.useState(false);

    const form = useForm<z.infer<typeof authFormSchema>>({
        resolver: zodResolver(authFormSchema),
        defaultValues: {
            email: "",
            password: ""
        },
    })

    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof authFormSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        setloading(true);
        console.log(values);
        setloading(false);
    }


    return (
        <section className='auth-form'>
            <header className='flex flex-col gap-5 md:gap-8'>
                <Link href='/' className='cursor-pointer items-center gap-1'>
                    <Image src="./icons/logo.svg" width={34} height={34} alt='Horizon' className='size-[24px] max-xl:size-14' />
                    <h1 className='text-26 font-ibm-plex-serif font-bold text-black-1'>Horizon</h1>
                </Link>
                <div className='flex flex-col gap-1 md:gap-3'>
                    <h1 className='text-24 lg:text-36 font-semibold text-gray-900'>{user ? 'Link account' : type === 'signin' ? 'Sign in' : 'Sign up'}
                        <p className='text-16 font-normal text-gray-600'>{user ? 'Link your account to get started' : 'Please enter your details'}</p>
                    </h1>
                </div>
            </header>
            {user ? (<div className='flex flex-col gap-4'>
                {/* Plain link component */}
            </div>) : (<>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                        {type === 'sign-up' && (
                            <>
                                <FormFieldItem
                                    control={form?.control}
                                    name='firstName'
                                    placeholder='enter your first name'
                                    type='text'
                                    label='First Name'
                                />
                                <FormFieldItem
                                    control={form?.control}
                                    name='lastName'
                                    placeholder='enter your last name'
                                    type='text'
                                    label='Last Name'
                                />
                                <FormFieldItem
                                    control={form?.control}
                                    name='state'
                                    placeholder='enter your state'
                                    type='text'
                                    label='State'
                                />
                                <FormFieldItem
                                    control={form?.control}
                                    name='postalCode'
                                    placeholder='enter your postal code'
                                    type='number'
                                    label='Postal Code'
                                /><FormFieldItem
                                    control={form?.control}
                                    name='dateOfBirth'
                                    placeholder='enter your date of birth'
                                    type='text'
                                    label='Date Of Birth'
                                />
                                <FormFieldItem
                                    control={form?.control}
                                    name='ssn'
                                    placeholder='enter your ssn'
                                    type='number'
                                    label='SSN'
                                />
                                <FormFieldItem
                                    control={form?.control}
                                    name='firstName'
                                    placeholder='enter your first name'
                                    type='text'
                                    label='First Name'
                                />
                            </>
                        )}



                        <FormFieldItem
                            control={form?.control}
                            name='email'
                            placeholder='enter your email'
                            type='text'
                            label='Email' />

                        <FormFieldItem
                            control={form?.control}
                            name='password'
                            placeholder='enter your password'
                            type='password'
                            label='Password'

                        />
                        <div className='flex flex-col gap-4'>
                            <Button className='form-btn' disabled={loading} type="submit">{loading ? (
                                <>
                                    <Loader2 size={20} className='animate-spin' /> &nbsp; Loading...
                                </>
                            ) : type === 'sign-in' ? 'Sign in' : 'Sign up'}</Button>
                        </div>
                    </form>
                </Form>

                <footer className='flex justify-center gap-1'>
                    <p className='text-14 font-normal text-gray-600'>{type === 'sign-in' ? "Don't have an account?" : "Already have an account?"}</p>
                    <Link href={type === 'sign-in' ? '/signup' : '/signin'} className='form-link'>
                        {type === 'sign-in' ? 'Sign up' : 'Sign in'}
                    </Link>
                </footer>
            </>)}
        </section>
    )
}

export default AuthForm;