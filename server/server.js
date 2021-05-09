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
        
                routers.forEach(router => {
                    router.liquidity.forEach(liquidityObj => {
                        if (liquidityObj.chainName === "Ethereum Mainnet" && liquidityObj.assetName === "ETH") {
                            ethMainnetETH = ethMainnetETH + liquidityObj.liquidity
                        }
                    })
                })

                db.collection('Aggregate').updateOne({
                    _id: new ObjectID('6097ffdda27d1c57def86535')
                }, {
                    $set: {
                        ethMainnetETH
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