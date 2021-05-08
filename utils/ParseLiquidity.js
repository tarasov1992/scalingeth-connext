const parseLiquidity = (data) => {
    // parse router name
    const routerNameRaw = data.subject
    let routerName = ''

    let i = 0
    while (routerNameRaw[i] !=='.') {
        routerName = routerName + routerNameRaw[i]
        i++
    }

    // parse on-chain liquidity
    const rows = data.data.metrics.split('\n')
    const liquidityStrs = []
    const liquidityObjs =[]

    rows.forEach(row => {
        if (row.indexOf('router_onchain_liquidity') === 0) {
            row = row.replace('router_onchain_liquidity{', '')
            liquidityStrs.push(row)
        }
    });

    liquidityStrs.forEach(str => {
        const vals = str.split('\} ')
        const assetData = vals[0].split(',')
        const obj = {
            chainName: assetData[0].replace('chainName="','').replace('\"', ''),
            chainId: parseInt(assetData[1].replace('chainId="','').replace('\"', '')),
            assetName: assetData[2].replace('assetName="','').replace('\"', ''),
            assetId: assetData[3].replace('assetId="','').replace('\"', ''),
            liquidity: parseFloat(vals[1])
        }
        liquidityObjs.push(obj)
    })

    // fill data into an object
    const routerData = {
        routerName,
        liquidity: liquidityObjs
    }

    return routerData
}

module.exports = parseLiquidity