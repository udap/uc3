pragma solidity ^0.4.19;

library Commons {
  byte constant HASH_ALG = 0x12;
  byte constant HASH_LEN = 0x20;

  struct MetaData {
      bytes32 nsi;
      address issuer;
      bool transferrable;
      bool fungible;
      string data;
      bytes32 dataRef;
  }
}
