import { logoutAccount } from '@/lib/actions/user.actions'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'

const Footer = ({ user, type }: FooterProps) => {
    const router = useRouter();

    const handleLogout = async () => {
        const loggedOut = await logoutAccount();
        console.log('Logout',loggedOut)
        if (loggedOut) {
            router.push('/signin'); 
        }
    }

    return (
        <footer className='footer'>
            <div className={type === 'mobile' ? 'footer_name-mobile' : 'footer_name'}>
                <p className='text-xl font-bold text-gray-700'>{user?.firstName?.[0]}</p>
            </div>
            <div className={type === 'mobile' ? 'footer_email-mobile' : 'footer_email'}>
                <h1 className='text-15 truncate  text-gray-600'>
                    {user?.firstName || user?.name}
                </h1>
                <p className='text-14 truncate font-normal text-gray-700 font-semibold'>{user?.email}</p>
            </div>

            <div className='footer_image' onClick={handleLogout}>
                <Image
                    src='icons/logout.svg'
                    width={30}
                    height={30}
                    alt='logout'
                />
            </div>
        </footer>
    )
}

export default Footer