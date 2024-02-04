import React, { createContext, useState, useContext, useEffect } from "react";

export const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      // checkNetwork();
      setWalletAddress("");
      setIsWalletConnected(false);
    } else {
      // checkNetwork();
      const newAccount = accounts[0];
      setWalletAddress(newAccount);
      setIsWalletConnected(true);
    }
  };

  useEffect(() => {
    const init = async () => {
      if (typeof window !== "undefined") {
        if (window.ethereum) {
          const accounts = await window.ethereum.request({
            method: "eth_accounts",
          });
          handleAccountsChanged(accounts);
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
    };

    init();
  }, []);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        console.log("Connecting to MetaMask");
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        if (accounts.length > 0) {
          // checkNetwork();
          setWalletAddress(accounts[0]);
          setIsWalletConnected(true);
          handleAccountsChanged(accounts);
        }
      } catch (error) {
        alert(
          "You rejected to connect to MetaMask. A valid wallet address must be provided and connected to the Sepolia network."
        );
        console.error("Error connecting to MetaMask:", error);
      }
    } else {
      alert("Please install MetaMask to use this feature.");
    }
  };

  function checkNetwork() {
    if (process.env.GATSBY_WEB3_NETWORK === "Sepolia") {
      const chainId = getCurrentNetwork();
      if (chainId !== "0x53") {
        switchToSepolia();
      }
    }
  }

  async function getCurrentNetwork() {
    if (window.ethereum) {
      try {
        return await window.ethereum.request({ method: "eth_chainId" });
      } catch (error) {
        console.error("Failed to get network Chain ID:", error);
      }
    } else {
      console.log("Ethereum provider is not available.");
    }
  }

  async function switchToSepolia() {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x53" }], // Chain ID for Sepolia
      });
      console.log("Switched to Sepolia Network");
    } catch (error) {
      // If the chain has not been added to the user's wallet, handle the error
      if (error.code === 4902) {
        console.log("Sepolia Network not found. Adding network...");
        addSepoliaNetwork();
      } else {
        console.error("Error switching to Sepolia Network:", error);
      }
    }
  }

  async function addSepoliaNetwork() {
    try {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: "0x53", // Sepolia's Chain ID
            chainName: "Sepolia Test Network",
            nativeCurrency: {
              name: "Ether",
              symbol: "ETH", // 2-6 characters long
              decimals: 18,
            },
            rpcUrls: ["https://rpc.sepolia.dev/"],
            blockExplorerUrls: ["https://sepolia.etherscan.io/"],
          },
        ],
      });
      console.log("Sepolia Network added to wallet");
    } catch (addError) {
      // Handle errors
      console.error("Error adding Sepolia Network:", addError);
    }
  }

  return (
    <WalletContext.Provider
      value={{ isWalletConnected, walletAddress, connectWallet }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
