import { Button, Typography } from "@mui/material";
import { ethers, Signer } from "ethers";
import { useEffect, useState } from "react";
import NFTCollectionContract from "./NFTCollection";
import NFTCollection from "./NFTCollection";

type Status = 'connected' | 'disconnected' | 'uninstalled';

const provider = new ethers.providers.Web3Provider(window.ethereum as any)

const LoginWithMetamask: React.FC = () => {
  // const [web3Provider, setWeb3Provider] = useState<ethers.Provider>();
  const [account, setAccount] = useState<ethers.providers.JsonRpcSigner>();
  const [status, setStatus] = useState<Status>('disconnected');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [defaultAccount, setDefaultAccount] = useState<string>('');
  const [userBalance, setUserBalance] = useState<number>(0);
  const [signer, setSigner] = useState<Signer>();



  const handleConnect = async () => {
    if (window.ethereum) {
      const accounts = await provider.send("eth_requestAccounts", [])
      const walletAddress = accounts[0]    // first account in MetaMask
      const signer = provider.getSigner(walletAddress)
      setSigner(signer)
    } else {
      setStatus("uninstalled")
      setErrorMessage("Please Install Metamask!!!");
    }
  };

  //   const accountChangedHandler = async (newAccount) => {
  //     const address = await newAccount.getAddress();
  //     setDefaultAccount(address);
  //     const balance = await newAccount.getBalance()
  //     setUserBalance(ethers.utils.formatEther(balance));
  //     await getuserBalance(address)
  // }
  // const getuserBalance = async (address) => {
  //     const balance = await provider.getBalance(address, "latest")
  // }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "16px",
      }}
    >
      <Typography variant="subtitle1" align="center">
        Logged in as {defaultAccount}
      </Typography>
      {signer && (
        <NFTCollectionContract signer={signer} />
      )}
      {/* )} */}
      {status === 'uninstalled' && (
        <Typography variant="subtitle1" align="center">
          {errorMessage}
        </Typography>
      )}
      {/* {!account && status === 'disconnected' && ( */}
      <Button
        variant="contained"
        sx={{ marginTop: "16px" }}
        onClick={handleConnect}
      >
        {defaultAccount ? "Connected!!" : "Connect"}
      </Button>
      {/* )} */}
    </div>
  );
};

export default LoginWithMetamask;
