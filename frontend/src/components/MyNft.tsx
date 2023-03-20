import { Button } from '@mui/material'
import React from 'react'

type Props = {
    balance: number | null;
}

export default function MyNft({ balance }: Props) {
    return (
        <div>
            {balance ?
                <h1>You have an NFT</h1>
                :
                <><div>You don't have any NFT Yet</div><Button variant='contained'>Mint</Button></>
            }
        </div>
    )

}