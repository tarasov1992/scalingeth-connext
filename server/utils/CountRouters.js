const countRouters = (db) => {
    db.collection('Liquidity').find().count().then((count) => {
        db.collection('Aggregate').updateOne({
            _id: new ObjectID('6097ffdda27d1c57def86535')
        }, {
            $set: {
                routerCount: count
            }
        })
    }).catch(err => console.log(err))
}

module.exports = countRouters