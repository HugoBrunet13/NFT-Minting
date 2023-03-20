import { useEffect, useState } from "react";
import logo from './logo.svg';
import './App.css';
import { Button } from "@mui/material";
import LoginWithMetamask from "./components/Dapp";

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <LoginWithMetamask/>
        {/* <Button variant="contained">Connect to MetaMask</Button> */}
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        {/* <p>
          ETH wallet connected as: 
        </p> */}
        {/* <Button variant="contained">Disconnect MetaMask</Button> */}
      </header>
    </div>
  );
}

export default App;