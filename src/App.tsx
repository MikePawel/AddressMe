import "./App.global.css";
import styles from "./App.module.css";

import { Navigation } from "./components/Navigation";
import { Display } from "./components/Display";
import { MetaMaskError } from "./components/MetaMaskError";
import { MetaMaskContextProvider } from "./hooks/useMetaMask";
import { Routes, Route } from "react-router-dom";
import Encryption from "./pages/Encryption/Encryption";
import DataDisplay from "./pages/DataDisplay/DataDisplay";

export const App = () => {
  return (
    <MetaMaskContextProvider>
      <div className={styles.appContainer}>
        <Navigation />
        <Routes>
          <Route path="/encryption" element={<Encryption />} />
          <Route path="/" element={<Display />} />
          <Route path="/dataDisplay" element={<DataDisplay />} />
        </Routes>
        <MetaMaskError />
      </div>
    </MetaMaskContextProvider>
  );
};
