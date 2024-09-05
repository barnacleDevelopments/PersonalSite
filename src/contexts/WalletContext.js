import React, { createContext, useState, useContext, useEffect } from "react";
import provider from "../web3-provider";
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
      try {
        const hasWallet = await checkWallet();
        if (hasWallet) {
          await checkNetwork();
          const accounts = await window.ethereum.request({
            method: "eth_accounts",
          });
          handleAccountsChanged(accounts);
          window.ethereum.on("accountsChanged", handleAccountsChanged);
        } else {
          console.log("MetaMask is not installed!");
        }
      } catch (error) {
        alert("User rejected to switch networks");
      }
    };

    init();

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged,
        );
      }
    };
  }, []);

  const connectWallet = async () => {
    return new Promise(async (resolve, reject) => {
      const hasWallet = await checkWallet();
      if (hasWallet) {
        try {
          const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          });

          if (accounts.length > 0) {
            const success = await checkNetwork();
            setWalletAddress(accounts[0]);
            setIsWalletConnected(true);
            handleAccountsChanged(accounts);
            resolve();
          } else {
            reject();
          }
        } catch (error) {
          console.error("Error connecting to MetaMask:", error);
          reject();
        }
      } else {
        alert("Please install MetaMask to use this feature.");
      }
    });
  };

  async function checkWallet() {
    if (typeof window.ethereum !== undefined) {
      provider.eth.setProvider(window.ethereum);
      return true;
    } else {
      return false;
    }
  }

  async function checkNetwork() {
    return new Promise(async (resolve, reject) => {
      const chainId = await getCurrentNetwork();
      try {
        if (process.env.GATSBY_WEB3_NETWORK === "Sepolia") {
          if (chainId !== "0xaa36a7") {
            await switchNetwork("0xaa36a7");
          }
        } else {
          await switchNetwork("0x539");
        }
        resolve();
      } catch (error) {
        console.log("Reject to switch networks");
        provider.setProvider(process.env.GATSBY_WEB3_WS_URL);
        reject();
      }
    });
  }

  async function getCurrentNetwork() {
    try {
      return await window.ethereum.request({ method: "eth_chainId" });
    } catch (error) {
      console.error("Failed to get network Chain ID:", error);
    }
  }

  function switchNetwork(chainId) {
    return new Promise(async (resolve, reject) => {
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId }], // Chain ID for Sepolia
        });
        console.log("Switched to " + chainId);
        resolve();
      } catch (error) {
        reject();
        // // If the chain has not been added to the user's wallet, handle the error
        // if (error.code === 4902) {
        //   console.log("Sepolia Network not found. Adding network...");
        //   addSepoliaNetwork();
        // } else {
        //   console.error("Error switching to Sepolia Network:", error);
        // }
      }
    });
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
      value={{ isWalletConnected, walletAddress, connectWallet, checkNetwork }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
