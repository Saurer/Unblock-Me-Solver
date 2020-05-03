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

        return config;
    }
});
