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
      </header>
    </div>
  );
}

export default App;
