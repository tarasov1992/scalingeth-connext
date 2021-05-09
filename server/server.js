const express = require('express')
const { MongoClient, ObjectID } = require('mongodb')
const listenToMetrics = require('./utils/ListenToMetrics')
const parseLiquidity = require('./utils/ParseLiquidity')
require('dotenv/config')

const app = express()
const port = process.env.PORT || 3001

const connectionURL = process.env.DB_CONNECTION
const databaseName = 'connext-analytics'

MongoClient.connect(connectionURL, { useNewUrlParser: true, useUnifiedTopology: true }).then((client) => {
    console.log('Connected to the db.')
    
    const db = client.db(databaseName)

    app.get('/api', (req, res) => {
        try {

            db.collection('Liquidity').find().count().then((count) => {
                db.collection('Aggregate').updateOne({
                    _id: new ObjectID('6097ffdda27d1c57def86535')
                }, {
                    $set: {
                        routerCount: count
                    }
                })
            }).catch(err => console.log(err))

            db.collection('Liquidity').find().toArray().then(routers => {
                let ethMainnetETH = 0
                let ethMainnetUSDT = 0

                let smartChainMainnetBNB = 0
                let smartChainMainnetDAI = 0
                let smartChainMainnetUSDT = 0
                let smartChainMainnetUSDC = 0

                let xDAIMainnetXDAI = 0
                let xDAIMainnetUSDT = 0

                let maticMainnetMATIC = 0
                let maticMainnetDAI = 0
                let maticMainnetUSDT = 0
                let maticMainnetUSDC = 0
                let maticMainnetwETHPOS = 0

                let huobiMainnetHUSD = 0
        
                routers.forEach(router => {
                    router.liquidity.forEach(liquidityObj => {
                        if (liquidityObj.chainName === "Ethereum Mainnet") {
                            if (liquidityObj.assetName === "ETH") {
                                ethMainnetETH = ethMainnetETH + liquidityObj.liquidity
                            } else if (liquidityObj.assetName === "USDT") {
                                ethMainnetUSDT = ethMainnetUSDT + liquidityObj.liquidity
                            }
                        } else if (liquidityObj.chainName === "Binance Smart Chain Mainnet") {
                            if (liquidityObj.assetName === "BNB") {
                                smartChainMainnetBNB = smartChainMainnetBNB + liquidityObj.liquidity
                            } else if (liquidityObj.assetName === "DAI") {
                                smartChainMainnetDAI = smartChainMainnetDAI + liquidityObj.liquidity
                            } else if (liquidityObj.assetName === "USDT") {
                                smartChainMainnetUSDT = smartChainMainnetUSDT + liquidityObj.liquidity
                            } else if (liquidityObj.assetName === "USDC") {
                                smartChainMainnetUSDC = smartChainMainnetUSDC + liquidityObj.liquidity
                            }
                        } else if (liquidityObj.chainName === "xDAI Chain") {
                            if (liquidityObj.assetName === "XDAI") {
                                xDAIMainnetXDAI = xDAIMainnetXDAI + liquidityObj.liquidity
                            } else if (liquidityObj.assetName === "USDT") {
                                xDAIMainnetUSDT = xDAIMainnetUSDT + liquidityObj.liquidity
                            }
                        } else if (liquidityObj.chainName === "Matic Mainnet") {
                            if (liquidityObj.assetName === "Token") {
                                maticMainnetMATIC = maticMainnetMATIC + liquidityObj.liquidity
                            } else if (liquidityObj.assetName === "USDT") {
                                maticMainnetUSDT = maticMainnetUSDT + liquidityObj.liquidity
                            } else if (liquidityObj.assetName === "USDC") {
                                maticMainnetUSDC = maticMainnetUSDC + liquidityObj.liquidity
                            } else if (liquidityObj.assetName === "WETH (PoS)") {
                                maticMainnetwETHPOS = maticMainnetwETHPOS + liquidityObj.liquidity
                            } else if (liquidityObj.assetName === "DAI") {
                                maticMainnetDAI = maticMainnetDAI + liquidityObj.liquidity
                            }
                        } else if (liquidityObj.chainName === "Huobi ECO Chain Mainnet") {
                            if (liquidityObj.assetName === "HUSD") {
                                huobiMainnetHUSD = huobiMainnetHUSD + liquidityObj.liquidity
                            }
                        }
                    })
                })

                db.collection('Aggregate').updateOne({
                    _id: new ObjectID('6097ffdda27d1c57def86535')
                }, {
                    $set: {
                        ethMainnetETH,
                        ethMainnetUSDT,
                        smartChainMainnetBNB,
                        smartChainMainnetDAI,
                        smartChainMainnetUSDT,
                        smartChainMainnetUSDC,
                        xDAIMainnetXDAI,
                        xDAIMainnetUSDT,
                        maticMainnetMATIC,
                        maticMainnetDAI,
                        maticMainnetUSDT,
                        maticMainnetUSDC,
                        maticMainnetwETHPOS,
                        huobiMainnetHUSD
                    }
                })
            }).catch(err => console.log(err))

            db.collection('Aggregate').find().toArray().then(data =>{
                res.json(data)
            }).catch(err => res.json({ message: err }))
        } catch (err) {
            res.json({ message: err })
        }
    })

    listenToMetrics((metrics) => {
        const routerLiquidity = parseLiquidity(metrics)
        
        db.collection('Liquidity').findOne({ routerName: routerLiquidity.routerName }).then((result) => {
            if (result === null) {
                db.collection('Liquidity').insertOne(routerLiquidity)
            } else {
                db.collection('Liquidity').updateOne({ 
                    routerName: routerLiquidity.routerName 
                } , {
                    $set: {
                        liquidity: routerLiquidity.liquidity
                    }
                })
            }
        }).catch((error) => console.log(error))

        console.log('done')
    })
}).catch((error) => console.log(error))

app.listen(port, () => {
    console.log('Server is listening on port ' + port)
})