import React from 'react'
import './App.css';

function App() {
  const [data, setData] = React.useState(null)

  React.useEffect(() => {
    fetch('/api')
      .then((res) => res.json())
      .then((data) => {
        setData(data[0])
      })
  })

  return (
    <div className="App">
      <header className="App-header">
        <p>{ !data ? 'Loading...': 'Routers in the Network: ' + data.routerCount }</p>
        <p>{ !data ? 'Loading...': 'Total ETH Liquidity on Ethereum Mainnet: ' + data.ethMainnetETH }</p>
        <p>{ !data ? 'Loading...': 'Total USDT Liquidity on Ethereum Mainnet: ' + data.ethMainnetUSDT }</p>
        <p>{ !data ? 'Loading...': 'Total BNB Liquidity on Smart Chain Mainnet: ' + data.smartChainMainnetBNB }</p>
        <p>{ !data ? 'Loading...': 'Total USDT Liquidity on Smart Chain Mainnet: ' + data.smartChainMainnetUSDT }</p>
        <p>{ !data ? 'Loading...': 'Total USDC Liquidity on Smart Chain Mainnet: ' + data.smartChainMainnetUSDC }</p>
        <p>{ !data ? 'Loading...': 'Total XDAI Liquidity on xDAI Mainnet: ' + data.xDAIMainnetXDAI }</p>
        <p>{ !data ? 'Loading...': 'Total USDT Liquidity on xDAI Mainnet: ' + data.xDAIMainnetUSDT }</p>
        <p>{ !data ? 'Loading...': 'Total MATIC Liquidity on Polygon Mainnet: ' + data.maticMainnetMATIC }</p>
        <p>{ !data ? 'Loading...': 'Total DAI Liquidity on Polygon Mainnet: ' + data.maticMainnetDAI }</p>
        <p>{ !data ? 'Loading...': 'Total USDT Liquidity on Polygon Mainnet: ' + data.maticMainnetUSDT }</p>
        <p>{ !data ? 'Loading...': 'Total UDSC Liquidity on Polygon Mainnet: ' + data.maticMainnetUSDC }</p>
        <p>{ !data ? 'Loading...': 'Total wETH (POS) Liquidity on Polygon Mainnet: ' + data.maticMainnetwETHPOS }</p>
        <p>{ !data ? 'Loading...': 'Total HUSD Liquidity on Huobi ECO Mainnet: ' + data.huobiMainnetHUSD }</p>
      </header>
    </div>
  );
}

export default App;
