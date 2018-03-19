// var ConvertLib = artifacts.require("./ConvertLib.sol");
var StandardAsset = artifacts.require("./StandardAsset.sol");

module.exports = function(deployer) {
  // deployer.deploy(ConvertLib);
  // deployer.link(ConvertLib, MetaCoin);
  deployer.deploy(StandardAsset);
};
