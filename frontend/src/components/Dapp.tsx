import { Box, Button, Typography } from "@mui/material";
import { ethers, Signer } from "ethers";
import { useEffect, useState } from "react";
import NFTCollectionContract from "./NFTCollection";
import logoMetaMask from "../img/metamask.png"
import React from "react";

type Status = 'connected' | 'disconnected' | 'uninstalled';

const DApp: React.FC = () => {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider>();
  const [status, setStatus] = useState<Status>('disconnected');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [signer, setSigner] = useState<Signer>();
  const [metamaskAccount, setMetamaskAccount] = useState<string>('');

  useEffect(() => {
    const initApp = async () => {
      if (window.ethereum) {
        const web3Provider = new ethers.providers.Web3Provider(window.ethereum as any)
        setProvider(web3Provider)
        const chainId = await web3Provider.send("eth_chainId", []);
        if (chainId !== '0xaa36a7') {
          await web3Provider.send("wallet_switchEthereumChain", [{ chainId: '0xaa36a7' }])
        }
      } else {
        setStatus("uninstalled")
        setErrorMessage("Please Install Metamask!!!");
      }
    }
    initApp()
  }, []);

  if (window.ethereum) {
    (window.ethereum as any).on('accountsChanged', function (accounts: any) {
      setMetamaskAccount(accounts[0])
    })
  }

  useEffect(() => {
    if (metamaskAccount && provider) {
      const signer = provider.getSigner(metamaskAccount)
      setSigner(signer)
    }
  }, [metamaskAccount])



  const handleConnect = async () => {
    if (window.ethereum && provider) {
      const accounts = await provider.send("eth_requestAccounts", [])
      const metamaskAccount = accounts[0]
      setMetamaskAccount(metamaskAccount)
      const signer = provider.getSigner(metamaskAccount)
      setSigner(signer)
    } else {
      setStatus("uninstalled")
      setErrorMessage("Please Install Metamask!!!");
    }
  };



  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "16px",
        width: "100%"
      }}
    >
      {status === 'uninstalled'
        ? <Typography variant="subtitle1" align="center" color={"error"}>
          {errorMessage}
        </Typography>
        : !metamaskAccount ?
          <>
            <Box
              component="img"
              sx={{
                height: 400,
                width: 400,
              }}
              alt="Metamask."
              src={logoMetaMask}
            />
            <Button
              variant="contained"
              sx={{ marginTop: "16px" }}
              onClick={handleConnect}
            >
              Connect
            </Button></>
          : signer ?
            <React.Fragment>
              <Typography variant="subtitle1" align="center">
                Logged in as {metamaskAccount}
              </Typography>
              <NFTCollectionContract signer={signer} />
            </React.Fragment>
            : <></>
      }
    </div>
  );
};

export default DApp;
