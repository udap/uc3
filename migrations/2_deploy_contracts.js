// var ConvertLib = artifacts.require("./ConvertLib.sol");
var AssetRegistry = artifacts.require("./AssetRegistry.sol");

module.exports = function(deployer) {
  // deployer.deploy(ConvertLib);
  // deployer.link(ConvertLib, MetaCoin);
  deployer.deploy(AssetRegistry);
};
