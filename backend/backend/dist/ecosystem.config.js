module.exports = {
    apps: [
        {
            name: 'spaceboo-server',
            instances: 0,
            script: './server.js',
            wait_ready: false,
            watch: true,
            env: {
                PORT: 8000,
                NODE_ENV: 'development',
            },
            env_production: {
                PORT: 80,
                NODE_ENV: 'production',
            },
        },
    ],
};
//# sourceMappingURL=ecosystem.config.js.map