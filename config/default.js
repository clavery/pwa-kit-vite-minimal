
module.exports = {
    externals: [],
    pageNotFoundURL: '/page-not-found',
    ssrEnabled: true,
    ssrOnly: ['ssr.js', 'ssr.js.map', 'node_modules/**/*.*', 'assets/**/*.*', 'server/**/*.*'],
    ssrShared: [
        'client/**/*.*'
    ],
    ssrParameters: {
        ssrFunctionNodeVersion: '20.x',
        proxyConfigs: [
            {
                host: 'kv7kzm78.api.commercecloud.salesforce.com',
                path: 'api'
            },
            {
                host: 'abcd-123.dx.commercecloud.salesforce.com',
                path: 'ocapi'
            }
        ]
    }
}