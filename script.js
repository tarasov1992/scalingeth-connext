const listenToMetrics = require('./utils/ListenToMetrics')
const parseLiquidity = require('./utils/ParseLiquidity')

listenToMetrics((metrics) => {
    const routerData = parseLiquidity(metrics)
    console.log(routerData)
})