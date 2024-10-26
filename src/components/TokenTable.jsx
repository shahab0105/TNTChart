import React, { useEffect, useState } from "react";
import TokenRow from "./common/TokenRow";
import Modal from 'react-modal';
import {
  formatNumber,
  checkTokenSymbol,
} from "../utils/funcs";
import "./style.css";
//ensure the token has the same structure, this is where we should be using static types
const dummyToken = {
  name: "Sample Token",
  symbol: "STK",
  price: "$5.25",
  marketCap: "$10,000,000",
  volume: "$500,000",
  circulatingSupply: "2,000,000 STK",
  totalSupply: "10,000,000 STK",
  description: "A sample token used for testing purposes.",
  website: "https://sampletoken.org"
};

const TokenInfoModal = ({ isOpen, onClose, token }) => {
  return (
      <Modal isOpen={isOpen} onRequestClose={onClose}  style={{
        overlay: { 
            zIndex: 1000, 
            backgroundColor: 'rgba(0, 0, 0, 0.5)' 
        },
        content: { 
            top: '10%', 
            left: '10%', 
            right: '10%', 
            bottom: '10%',
            backgroundColor: '#191919', // Same as table background
            color: 'white', // Font color to match
            border: '1px solid #444', // Border similar to table style
            borderRadius: '8px', 
            padding: '20px',
            fontFamily: 'inherit'
        }
    }}>
           <h2>{token?.symbol}</h2>
      <p>Price: ${token?.derivedUSD}</p>
      <p>Market Cap: ${formatNumber(token?.tradeVolumeUSD)}</p>
      <p>Liquidity: ${formatNumber(token?.totalLiquidityUSD)}</p>
      <p>Volume: ${formatNumber(token?.tradeVolume)}</p>
      <p>24H Volume ETH: {token?.volume24HrsETH}</p>
      <p>Trade Volume ETH: {token?.tradeVolumeETH}</p>
          <button onClick={onClose}>Close</button>
      </Modal>
  );
};

const TokenTable = ({ tokenData }) => {
  const [sortedData, setSortedData] = useState([...tokenData]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [selectedToken, setSelectedToken] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const sortData = (key) => {
    let direction = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    const sorted = [...tokenData].sort((a, b) => {
      if (a[key] * 1 < b[key] * 1) {
        return direction === "asc" ? -1 : 1;
      }
      if (a[key] * 1 > b[key] * 1) {
        return direction === "asc" ? 1 : -1;
      }
      return 0;
    });
    setSortedData([...sorted]);
    setSortConfig({ key, direction });
  };

  const renderSortIcon = (columnName) => {
    if (sortConfig && sortConfig.key === columnName) {
      return sortConfig.direction === "asc" ? "▲" : "▼";
    }
    return null;
  };

  const tableStyle = {
    backgroundColor: "#191919",
    overflowY: "auto",
    maxHeight: "90vh",
    width: "100%",
    cursor: "pointer",
  };
  useEffect(() => {
    setSortedData(tokenData);
  }, [tokenData]);
  return (
    <div className="table-container font-header" style={tableStyle}>
      <table
        className="custom-table"
        style={{
          width: "100%",
          marginTop: "15px",
          marginBottom: "20px",
          fontSize: "medium",
        }}
      >
        <thead className="font-header">
          <tr>
            <th
              onClick={() => sortData("symbol")}
              style={{ textAlign: "start" }}
            >
              TOKEN {renderSortIcon("symbol")}
            </th>
            <th
              onClick={() => sortData("derivedUSD")}
              style={{ textAlign: "start" }}
            >
              PRICE {renderSortIcon("derivedUSD")}
            </th>
            <th
              onClick={() => sortData("tradeVolumeUSD")}
              style={{ textAlign: "start" }}
            >
              MARKETCAP {renderSortIcon("tradeVolumeUSD")}
            </th>
            <th
              onClick={() => sortData("totalLiquidityUSD")}
              style={{ textAlign: "start" }}
            >
              LIQUIDITY {renderSortIcon("totalLiquidityUSD")}
            </th>
            <th
              onClick={() => sortData("tradeVolume")}
              style={{ textAlign: "start" }}
            >
              VOLUME {renderSortIcon("tradeVolume")}
            </th>
            <th style={{ textAlign: "start", paddingRight: "80px" }}>
              TOKEN AGE
            </th>
            {/* <th>Token Age</th> */}
          </tr>
        </thead>
        <tbody style={{ backgroundColor: "black" }}>
          {[...sortedData].map((rowData, index) => (
            <TokenRow data={rowData} key={index} onClick={() => {
              setSelectedToken(rowData);
              setIsModalOpen(true);
          }}/>
          ))}
        </tbody>
      </table>
      <TokenInfoModal 
    isOpen={isModalOpen} 
    onClose={() => setIsModalOpen(false)} 
    token={selectedToken || dummyToken} 
/>
    </div>
  );
};

export default TokenTable;
