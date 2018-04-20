module.exports = {
    // See <http://truffleframework.com/docs/advanced/configuration>
    // to customize your Truffle configuration!
    networks: {
        development: {
            host: "127.0.0.1",
            port: 8545,
            network_id: "*", // Match any network id
            from: "0x67f09ED73F2Fe18965d6f35325Ec983Aff2532e6",//private key c2e3c1dec1ca3b77f6e8d58aac4919f930d7653ea44f735810b79800ffadc7f4
            gas: 3100000
        },
        rinkeby: {
            host: "127.0.0.1",
            port: 8545,
            network_id: "*", // Match any network id
            from: "0x67f09ED73F2Fe18965d6f35325Ec983Aff2532e6",//private key c2e3c1dec1ca3b77f6e8d58aac4919f930d7653ea44f735810b79800ffadc7f4
        },
        test: {
            host: "127.0.0.1",
            port: 9545,
            network_id: "*" // Match any network id
        }
    }

};
