import { Box, Link, Typography } from '@mui/material'
import { Contract, ethers, Signer } from 'ethers'
import { useEffect, useState } from 'react'
import NFTCollectionContractAddress from '../contracts/contract-address.json'
import NFTCollectionArtifacts from '../contracts/NFTCollection.json'
import MintNFTForm from './MintNFTForm'
import MyNft from './MyNft'

type Props = {
  signer: Signer;
}

export default function NFTCollectionContract({ signer }: Props) {
  const [contract, setContract] = useState<Contract>()
  const [contractName, setContractName] = useState<string>("")
  const [contractExplorerURL, setContractExplorerURL] = useState<string>("")



  const [contractMaxNfts, setContractMaxNfts] = useState<number>(0)
  const [countMintedToken, setCountMintedToken] = useState<number>(0)
  const [contractMintStart, setContractMintStart] = useState<number>(0)
  const [contractMintStop, setContractMintStop] = useState<number>(0)
  const [userNFTId, setUserNFTId] = useState<number>(0)

  const canMint = (timestamp: number): boolean => {
    return Date.now() / 1000 < timestamp;
  }

  useEffect(() => {
    const getContract = async () => {
      const contract = new ethers.Contract(NFTCollectionContractAddress.NFTCollection, NFTCollectionArtifacts.abi, signer);
      const contractName = await contract.name()
      setContract(contract)
      setContractName(contractName)

    }
    getContract()
  }, [signer])

  const convertTimestampToDate = (timestamp: number): string => {
    const date = new Date(timestamp * 1000)
    return date.toDateString() + ", " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()
  }


  useEffect(() => {
    const getContractDetails = async () => {
      if (contract) {
        setContractMaxNfts((await contract.maxNFTs()).toNumber())
        setCountMintedToken((await contract.getCurrentToken()).toNumber())
        setContractMintStart((await contract.mintWindowStart()).toNumber())
        setContractMintStop((await contract.mintWindowEnd()).toNumber())
        setUserNFTId((await contract.getMyNFT()).toNumber())
        setContractExplorerURL("https://sepolia.etherscan.io/address/" + contract.address)
      }
    }
    getContractDetails()
  }, [contract])

  useEffect(() => {
    const getCountToken = async () => {
      if (contract) {
        setCountMintedToken((await contract.getCurrentToken()).toNumber())
      }
    }
    getCountToken()
  }, [countMintedToken])

  return (
    <div>
      {contract && (

        <Box
          sx={{
            minWidth: '500px'
          }}>
          <Box sx={{
            marginTop: '20px',
            borderRadius: '30px',
            boxShadow: 1,
          }}
          >
            <Typography variant={"h3"}>
              {contractName}
            </Typography>
            <div>Start: {convertTimestampToDate(contractMintStart)}</div>
            <div>Stop: {convertTimestampToDate(contractMintStop)}</div>
            <div>Minted NFTs: {countMintedToken}/{contractMaxNfts}</div>
            <Typography variant={'subtitle1'}>
              <Link color="inherit" component={"button"}>
                <a href={contractExplorerURL} target="_blank" rel="noopener noreferrer">
                  {contract.address}
                </a>
              </Link>
            </Typography>
          </Box>
          {(userNFTId > 0)
            ? <MyNft contract={contract} nftId={userNFTId} />
            : <MintNFTForm setUserNFTId={setUserNFTId} canMint={canMint(contractMintStop)} signer={signer} />
          }
        </Box>


      )}
    </div>
  )
}