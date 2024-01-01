import React, { createContext, useState, useContext, useEffect } from "react";

export const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      console.log("Please connect to MetaMask.");
    } else {
      const newAccount = accounts[0];
      console.log("New account:", newAccount);
      setWalletAddress(newAccount);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.ethereum) {
        window.ethereum.on("accountsChanged", handleAccountsChanged);
      } else {
        console.log("MetaMask is not installed!");
      }

      return () => {
        if (window.ethereum) {
          window.ethereum.removeListener(
            "accountsChanged",
            handleAccountsChanged
          );
        }
      };
    }
  }, []);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        console.log("Connecting to MetaMask");
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setWalletAddress(accounts[0]);
        setIsWalletConnected(true);
        handleAccountsChanged(accounts);
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
      }
    } else {
      alert("Please install MetaMask to use this feature.");
    }
  };

  return (
    <WalletContext.Provider
      value={{ isWalletConnected, walletAddress, connectWallet }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
