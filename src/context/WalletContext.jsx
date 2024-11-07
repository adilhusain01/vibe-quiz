import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { networks } from '../utils/networks';

export const WalletContext = createContext();

const WalletProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [network, setNetwork] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);

  const checkAndSetNetwork = async () => {
    try {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      const networkName = networks[chainId] || 'Unknown Network';
      setNetwork(networkName);
      return networkName;
    } catch (error) {
      console.error('Error checking network:', error);
      return 'Unknown Network';
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert('Get MetaMask -> https://metamask.io/');
        return;
      }

      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });
      if (accounts.length > 0) {
        const account = accounts[0];
        setWalletAddress(account);
        localStorage.setItem('walletAddress', account);
        await checkAndSetNetwork(); // Check network immediately after connecting
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log('Make sure you have MetaMask!');
        setIsInitialized(true);
        return;
      }

      const accounts = await ethereum.request({ method: 'eth_accounts' });
      if (accounts.length === 0) {
        setWalletAddress(null);
        localStorage.removeItem('walletAddress');
      } else {
        const account = accounts[0];
        setWalletAddress(account);
        localStorage.setItem('walletAddress', account);
        await checkAndSetNetwork();
      }
      setIsInitialized(true);
    } catch (error) {
      console.error('Error checking wallet connection:', error);
      setIsInitialized(true);
    }
  };

  const switchNetwork = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0xe705' }],
        });

        await checkAndSetNetwork();
        const accounts = await window.ethereum.request({
          method: 'eth_accounts',
        });
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          localStorage.setItem('walletAddress', accounts[0]);
        }
      } catch (error) {
        if (error.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: '0xe705',
                  chainName: 'Linea Sepolia',
                  rpcUrls: ['https://linea-sepolia.infura.io/v3/'],
                  nativeCurrency: {
                    name: 'ETH',
                    symbol: 'ETH',
                    decimals: 18,
                  },
                  blockExplorerUrls: ['https://sepolia.lineascan.build/'],
                },
              ],
            });
            await checkAndSetNetwork();
          } catch (addError) {
            console.error('Error adding Ethereum chain:', addError);
          }
        } else {
          console.error('Error switching network:', error);
        }
      }
    } else {
      alert(
        'MetaMask is not installed. Please install it to use this app: https://metamask.io/download.html'
      );
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();

    const handleAccountsChanged = async (accounts) => {
      if (accounts.length === 0) {
        setWalletAddress(null);
        localStorage.removeItem('walletAddress');
      } else {
        setWalletAddress(accounts[0]);
        localStorage.setItem('walletAddress', accounts[0]);
        await checkAndSetNetwork();
      }
    };

    const handleChainChanged = async () => {
      await checkAndSetNetwork();
    };

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum.removeListener(
          'accountsChanged',
          handleAccountsChanged
        );
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, []);

  return (
    <WalletContext.Provider
      value={{
        walletAddress,
        connectWallet,
        switchNetwork,
        network,
        isInitialized,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

WalletProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default WalletProvider;
