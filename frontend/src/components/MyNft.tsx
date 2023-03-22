import { Box, Card, CardActionArea, CardContent, CardMedia, Typography } from '@mui/material';
import axios from 'axios';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';

type Props = {
    nftId: number;
    contract: ethers.Contract;
}

type NFT = {
    name: string;
    description: string;
    image: string;
}

export default function MyNft({ nftId, contract }: Props) {
    const [myNFT, setMyNFT] = useState<NFT>()

    useEffect(() => {
        const getNFT = async (tokenId: number) => {
            try {
                const tokenURI = await contract.tokenURI(tokenId)
                let metadata = await axios.get(tokenURI, { headers: {} })
                setMyNFT({
                    name: metadata.data.name,
                    description: metadata.data.description,
                    image: metadata.data.image,
                } as NFT)
            } catch (e) {
                console.log("Error while fetching NFT metadata: ", e)
                setMyNFT({} as NFT)
            }
        }
        getNFT(nftId)
    }, [])

    return (
        <Box sx={{ marginTop: "20px" }}>
            <h4>You are the owner of 1 NFT of this collection:</h4>
            {(!myNFT?.name)
                ? <Box sx={{ color: "red" }}>
                    <h5>Error while fetching NFT Metadata</h5>
                    It can take a few minutes before all the data are sync in IPFS
                </Box>
                : <Card sx={{ marginTop: "20px", borderRadius: '30px' }}>
                    <CardActionArea>
                        <CardMedia
                            component="img"
                            height="500"
                            src={myNFT?.image}
                            alt={myNFT?.name}
                        />
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                {myNFT?.name} (#{nftId})
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Description: {myNFT?.description}
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            }
        </Box>

    )

}