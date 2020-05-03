const withWorkers = require('@zeit/next-workers');

module.exports = withWorkers({
    workerLoaderOptions: { inline: true },
    webpack: config => {
        config.resolve.modules = [__dirname, ...config.resolve.modules];

        config.node = {
            fs: 'empty'
        };

        config.module.rules.push({
            test: /\.(ts|js)(x?)$/,
            enforce: 'pre',
            exclude: ['/node_modules/', '/.next/'],
            use: {
                loader: 'eslint-loader',
                options: {
                    emitWarning: true,
                    failOnWarning: false
                }
            }
        });

        // config.module.rules.push({
        //     test: /\.worker\.ts$/,
        //     loader: 'worker-loader',
        //     options: {
        //         name: 'static/[hash].worker.js',
        //         publicPath: '/_next/'
        //     }
        // });
        // config.output.globalObject = `(typeof self !== 'undefined' ? self : this)`;
        return config;
    }
});
