import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { WalletContext } from "../context/WalletContext";
import Logo from "../assets/logo.png";
import Linea from "../assets/linea.svg";

const Header = () => {
  const {
    walletAddress,
    connectWallet,
    network,
    switchNetwork,
    isInitialized,
  } = useContext(WalletContext);

  const truncateAddress = (address) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-6)}`;
  };

  // Don't render the switch network button until initialization is complete
  if (!isInitialized) {
    return (
      <nav className="px-4 md:px-24 h-24 flex items-center justify-between bg-white/5 backdrop-blur-lg border-b border-white/10">
        <Link to={"/"} className="flex items-center gap-2 group">
          <div className="relative w-14 h-14 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-xl p-2 transition-all duration-300 group-hover:scale-105">
            <img
              src={Logo}
              alt="Vibe Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold">
            <span className="text-white">Vibe</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-pink-400">
              Quiz
            </span>
          </h1>
        </Link>
      </nav>
    );
  }

  return (
    <nav className="px-4 md:px-24 h-24 flex items-center justify-between bg-white/5 backdrop-blur-lg border-b border-white/10">
      <Link to={"/"} className="flex items-center gap-2 group">
        <div className="relative w-14 h-14 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-xl p-2 transition-all duration-300 group-hover:scale-105">
          <img
            src={Logo}
            alt="Vibe Logo"
            className="w-full h-full object-contain"
          />
        </div>
        <h1 className="text-3xl font-bold">
          <span className="text-white">Vibe</span>
        </h1>
      </Link>
      <span className="flex flex-row gap-[2rem]">
        <div className="flex items-center gap-4">
          {walletAddress ? (
            network !== "Linea Sepolia" ? (
              <button
                onClick={switchNetwork}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl text-white font-medium hover:opacity-90 transition-all duration-300 shadow-lg shadow-red-500/25"
              >
                Switch to Linea Sepolia
              </button>
            ) : (
              <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl text-white font-medium hover:opacity-90 transition-all duration-300 shadow-lg shadow-red-500/25">
                <img src={Linea} alt="Linea Logo" />
                {truncateAddress(walletAddress)}
              </button>
            )
          ) : (
            <button
              onClick={connectWallet}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl text-white font-medium hover:opacity-90 transition-all duration-300 shadow-lg shadow-red-500/25"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </span>
    </nav>
  );
};

export default Header;
