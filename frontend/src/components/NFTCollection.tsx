import React, { useEffect, useState } from 'react'
import NFTCollectionArtifacts from '../contracts/NFTCollection.json'
import NFTCollectionContractAddress from '../contracts/contract-address.json'
import { ethers, Signer, Contract } from 'ethers'
import MyNft from './MyNft'

type Props = {
  signer: Signer;
}

export default function NFTCollectionContract({ signer }: Props) {
  const [contract, setContract] = useState<Contract>()
  const [contractName, setContractName] = useState<string>("")
  const [contractAddress, setContractAddress] = useState<string>("")
  
  const [userBalance, setUserBalance] = useState<number|null>();

  const [contractMaxNfts, setContractMaxNfts] = useState<number>(0)
  const [contractMintStart, setContractMintStart] = useState<number>(0)
  const [contractMintStop, setContractMintStop] = useState<number>(0)

  useEffect(() => {
    const getContract = async () => {
      const contract = new ethers.Contract(NFTCollectionContractAddress.NFTCollection, NFTCollectionArtifacts.abi,signer);
      const contractName = await contract.name()
      setContract(contract)
      setContractName(contractName)
      
    }
    getContract()
  }, [])

  useEffect(() => {

    const getContractDetails = async () => {
      
      if (contract) {
        console.log(contract)
        setContractMaxNfts( (await contract.maxNFTs()).toNumber())
        setContractMintStart((await contract.mintWindowStart()).toNumber())
        setContractMintStop((await contract.mintWindowEnd()).toNumber())
      }
    }
    getContractDetails()
  }, [contract])

  return (
    <div>
      {contract && (
        <>
          <div>{contractName}</div>
          <div>Address: {NFTCollectionContractAddress.NFTCollection} </div>
          <div>MaxNFTs: {contractMaxNfts} </div>
          <div>Start: {new Date(contractMintStart * 1000).toDateString()} </div>
          <div>Stop: {contractMintStop} </div>
          <MyNft balance={1}/>
        </>
        

      )}
    </div>
  )
}