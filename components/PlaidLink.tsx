import React, { useCallback, useEffect, useState } from 'react'
import { Button } from './ui/button'
import { PlaidLinkOnSuccess, PlaidLinkOptions, usePlaidLink } from 'react-plaid-link';
import { StyledString } from 'next/dist/build/swc/types';
import { useRouter } from 'next/navigation';
import { createLinkToken, exchangePublicToken } from '@/lib/actions/user.actions';

const PlaidLink = ({ user, variant }: PlaidLinkProps) => {

    const router = useRouter()

    const [token, setToken] = useState('');

    useEffect(() => {
        const getLinkToken = async () => {
            try {
                const data = await createLinkToken(user);
                if(data){
                  setToken(data?.linkToken);  
                }
                
            } catch (e) {
                console.log('Error', e)
            }

        };
        getLinkToken();
    }, [user])

    const onSuccess = useCallback<PlaidLinkOnSuccess>(async (public_token: string) => {
      const res =  await exchangePublicToken({
            publicToken: public_token,
            user
        })
        if(res){
           console.log('priv',res) 
        }
        router.push('/');
    }, [user])

    const config: PlaidLinkOptions = {
        token,
        onSuccess
    }

    const { open, ready } = usePlaidLink(config);

    return (
        <>
            {variant === 'primary' ? (
                <Button onClick={() => open()}
                    disabled={!ready}
                    className='plaidlink-primary'>
                    Connect Bank
                </Button>
            ) : variant === 'ghost' ? (
                <Button>Connect Bank</Button>
            ) : (
                <Button>
                    Connect Bank
                </Button>
            )}
        </>
    )
}

export default PlaidLink;