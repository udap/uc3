const Web3 = require('web3');

const standardAsset_artifacts = require('../../build/contracts/StandardAsset.json');
const Tx = require('ethereumjs-tx');
let ethereumCfg = {
    provider:"http://52.11.73.193:6969/child_0",
    address: '0xcabe9a163B96865308605bdE13233FD1A0610931',
    privateKey: '816a873c934de69b966d34a2bd464be55de47aea11deeb554de23d2b8b8b8f93'
};
const web3 = new Web3(new Web3.providers.HttpProvider(ethereumCfg.provider));

const privateKey = new Buffer(ethereumCfg.privateKey, 'hex');

/*let balance = web3.eth.getBalance("0x9e23bf76901ad8f2dc4f9557e4e7e2529991cc09");

console.log(balance);*/
let createUpxToken = ()=>{

    let upxAbi = [
        {
            "constant": true,
            "inputs": [],
            "name": "name",
            "outputs": [
                {
                    "name": "",
                    "type": "string"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_spender",
                    "type": "address"
                },
                {
                    "name": "_value",
                    "type": "uint256"
                }
            ],
            "name": "approve",
            "outputs": [
                {
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "totalSupply",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_from",
                    "type": "address"
                },
                {
                    "name": "_to",
                    "type": "address"
                },
                {
                    "name": "_value",
                    "type": "uint256"
                }
            ],
            "name": "transferFrom",
            "outputs": [
                {
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "decimals",
            "outputs": [
                {
                    "name": "",
                    "type": "uint8"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_spender",
                    "type": "address"
                },
                {
                    "name": "_subtractedValue",
                    "type": "uint256"
                }
            ],
            "name": "decreaseApproval",
            "outputs": [
                {
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "_owner",
                    "type": "address"
                }
            ],
            "name": "balanceOf",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "symbol",
            "outputs": [
                {
                    "name": "",
                    "type": "string"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_to",
                    "type": "address"
                },
                {
                    "name": "_value",
                    "type": "uint256"
                }
            ],
            "name": "transfer",
            "outputs": [
                {
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_spender",
                    "type": "address"
                },
                {
                    "name": "_addedValue",
                    "type": "uint256"
                }
            ],
            "name": "increaseApproval",
            "outputs": [
                {
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "_owner",
                    "type": "address"
                },
                {
                    "name": "_spender",
                    "type": "address"
                }
            ],
            "name": "allowance",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "name": "_initialSupply",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "name": "owner",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "name": "spender",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "name": "value",
                    "type": "uint256"
                }
            ],
            "name": "Approval",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "name": "from",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "name": "to",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "name": "value",
                    "type": "uint256"
                }
            ],
            "name": "Transfer",
            "type": "event"
        }
    ];
    var upxContract = web3.eth.contract(upxAbi);

    let byteCode = {
        "linkReferences": {},
        "object": "60806040526003805460ff1916601217905534801561001d57600080fd5b50604051602080610875833981016040908152905160035460ff16600a0a02600181905533600090815260208190529190912055610815806100606000396000f3006080604052600436106100ae5763ffffffff7c010000000000000000000000000000000000000000000000000000000060003504166306fdde0381146100b3578063095ea7b31461013d57806318160ddd1461017557806323b872dd1461019c578063313ce567146101c657806366188463146101f157806370a082311461021557806395d89b4114610236578063a9059cbb1461024b578063d73dd6231461026f578063dd62ed3e14610293575b600080fd5b3480156100bf57600080fd5b506100c86102ba565b6040805160208082528351818301528351919283929083019185019080838360005b838110156101025781810151838201526020016100ea565b50505050905090810190601f16801561012f5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34801561014957600080fd5b50610161600160a060020a03600435166024356102f1565b604080519115158252519081900360200190f35b34801561018157600080fd5b5061018a610357565b60408051918252519081900360200190f35b3480156101a857600080fd5b50610161600160a060020a036004358116906024351660443561035d565b3480156101d257600080fd5b506101db6104d4565b6040805160ff9092168252519081900360200190f35b3480156101fd57600080fd5b50610161600160a060020a03600435166024356104dd565b34801561022157600080fd5b5061018a600160a060020a03600435166105cd565b34801561024257600080fd5b506100c86105e8565b34801561025757600080fd5b50610161600160a060020a036004351660243561061f565b34801561027b57600080fd5b50610161600160a060020a0360043516602435610700565b34801561029f57600080fd5b5061018a600160a060020a0360043581169060243516610799565b60408051808201909152600a81527f5544415020546f6b656e00000000000000000000000000000000000000000000602082015281565b336000818152600260209081526040808320600160a060020a038716808552908352818420869055815186815291519394909390927f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925928290030190a350600192915050565b60015490565b6000600160a060020a038316151561037457600080fd5b600160a060020a03841660009081526020819052604090205482111561039957600080fd5b600160a060020a03841660009081526002602090815260408083203384529091529020548211156103c957600080fd5b600160a060020a0384166000908152602081905260409020546103f2908363ffffffff6107c416565b600160a060020a038086166000908152602081905260408082209390935590851681522054610427908363ffffffff6107d616565b600160a060020a03808516600090815260208181526040808320949094559187168152600282528281203382529091522054610469908363ffffffff6107c416565b600160a060020a03808616600081815260026020908152604080832033845282529182902094909455805186815290519287169391927fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef929181900390910190a35060019392505050565b60035460ff1681565b336000908152600260209081526040808320600160a060020a03861684529091528120548083111561053257336000908152600260209081526040808320600160a060020a0388168452909152812055610567565b610542818463ffffffff6107c416565b336000908152600260209081526040808320600160a060020a03891684529091529020555b336000818152600260209081526040808320600160a060020a0389168085529083529281902054815190815290519293927f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925929181900390910190a35060019392505050565b600160a060020a031660009081526020819052604090205490565b60408051808201909152600381527f5550580000000000000000000000000000000000000000000000000000000000602082015281565b6000600160a060020a038316151561063657600080fd5b3360009081526020819052604090205482111561065257600080fd5b33600090815260208190526040902054610672908363ffffffff6107c416565b3360009081526020819052604080822092909255600160a060020a038516815220546106a4908363ffffffff6107d616565b600160a060020a038416600081815260208181526040918290209390935580518581529051919233927fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9281900390910190a350600192915050565b336000908152600260209081526040808320600160a060020a0386168452909152812054610734908363ffffffff6107d616565b336000818152600260209081526040808320600160a060020a0389168085529083529281902085905580519485525191937f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925929081900390910190a350600192915050565b600160a060020a03918216600090815260026020908152604080832093909416825291909152205490565b6000828211156107d057fe5b50900390565b818101828110156107e357fe5b929150505600a165627a7a723058202a242c65ca2b91e11f66b1bdd758a8d3ced49eea6d4655b8b31fd7e8a8c7db370029",
        "opcodes": "PUSH1 0x80 PUSH1 0x40 MSTORE PUSH1 0x3 DUP1 SLOAD PUSH1 0xFF NOT AND PUSH1 0x12 OR SWAP1 SSTORE CALLVALUE DUP1 ISZERO PUSH2 0x1D JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH1 0x40 MLOAD PUSH1 0x20 DUP1 PUSH2 0x875 DUP4 CODECOPY DUP2 ADD PUSH1 0x40 SWAP1 DUP2 MSTORE SWAP1 MLOAD PUSH1 0x3 SLOAD PUSH1 0xFF AND PUSH1 0xA EXP MUL PUSH1 0x1 DUP2 SWAP1 SSTORE CALLER PUSH1 0x0 SWAP1 DUP2 MSTORE PUSH1 0x20 DUP2 SWAP1 MSTORE SWAP2 SWAP1 SWAP2 KECCAK256 SSTORE PUSH2 0x815 DUP1 PUSH2 0x60 PUSH1 0x0 CODECOPY PUSH1 0x0 RETURN STOP PUSH1 0x80 PUSH1 0x40 MSTORE PUSH1 0x4 CALLDATASIZE LT PUSH2 0xAE JUMPI PUSH4 0xFFFFFFFF PUSH29 0x100000000000000000000000000000000000000000000000000000000 PUSH1 0x0 CALLDATALOAD DIV AND PUSH4 0x6FDDE03 DUP2 EQ PUSH2 0xB3 JUMPI DUP1 PUSH4 0x95EA7B3 EQ PUSH2 0x13D JUMPI DUP1 PUSH4 0x18160DDD EQ PUSH2 0x175 JUMPI DUP1 PUSH4 0x23B872DD EQ PUSH2 0x19C JUMPI DUP1 PUSH4 0x313CE567 EQ PUSH2 0x1C6 JUMPI DUP1 PUSH4 0x66188463 EQ PUSH2 0x1F1 JUMPI DUP1 PUSH4 0x70A08231 EQ PUSH2 0x215 JUMPI DUP1 PUSH4 0x95D89B41 EQ PUSH2 0x236 JUMPI DUP1 PUSH4 0xA9059CBB EQ PUSH2 0x24B JUMPI DUP1 PUSH4 0xD73DD623 EQ PUSH2 0x26F JUMPI DUP1 PUSH4 0xDD62ED3E EQ PUSH2 0x293 JUMPI JUMPDEST PUSH1 0x0 DUP1 REVERT JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0xBF JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0xC8 PUSH2 0x2BA JUMP JUMPDEST PUSH1 0x40 DUP1 MLOAD PUSH1 0x20 DUP1 DUP3 MSTORE DUP4 MLOAD DUP2 DUP4 ADD MSTORE DUP4 MLOAD SWAP2 SWAP3 DUP4 SWAP3 SWAP1 DUP4 ADD SWAP2 DUP6 ADD SWAP1 DUP1 DUP4 DUP4 PUSH1 0x0 JUMPDEST DUP4 DUP2 LT ISZERO PUSH2 0x102 JUMPI DUP2 DUP2 ADD MLOAD DUP4 DUP3 ADD MSTORE PUSH1 0x20 ADD PUSH2 0xEA JUMP JUMPDEST POP POP POP POP SWAP1 POP SWAP1 DUP2 ADD SWAP1 PUSH1 0x1F AND DUP1 ISZERO PUSH2 0x12F JUMPI DUP1 DUP3 SUB DUP1 MLOAD PUSH1 0x1 DUP4 PUSH1 0x20 SUB PUSH2 0x100 EXP SUB NOT AND DUP2 MSTORE PUSH1 0x20 ADD SWAP2 POP JUMPDEST POP SWAP3 POP POP POP PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x149 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x161 PUSH1 0x1 PUSH1 0xA0 PUSH1 0x2 EXP SUB PUSH1 0x4 CALLDATALOAD AND PUSH1 0x24 CALLDATALOAD PUSH2 0x2F1 JUMP JUMPDEST PUSH1 0x40 DUP1 MLOAD SWAP2 ISZERO ISZERO DUP3 MSTORE MLOAD SWAP1 DUP2 SWAP1 SUB PUSH1 0x20 ADD SWAP1 RETURN JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x181 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x18A PUSH2 0x357 JUMP JUMPDEST PUSH1 0x40 DUP1 MLOAD SWAP2 DUP3 MSTORE MLOAD SWAP1 DUP2 SWAP1 SUB PUSH1 0x20 ADD SWAP1 RETURN JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x1A8 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x161 PUSH1 0x1 PUSH1 0xA0 PUSH1 0x2 EXP SUB PUSH1 0x4 CALLDATALOAD DUP2 AND SWAP1 PUSH1 0x24 CALLDATALOAD AND PUSH1 0x44 CALLDATALOAD PUSH2 0x35D JUMP JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x1D2 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x1DB PUSH2 0x4D4 JUMP JUMPDEST PUSH1 0x40 DUP1 MLOAD PUSH1 0xFF SWAP1 SWAP3 AND DUP3 MSTORE MLOAD SWAP1 DUP2 SWAP1 SUB PUSH1 0x20 ADD SWAP1 RETURN JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x1FD JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x161 PUSH1 0x1 PUSH1 0xA0 PUSH1 0x2 EXP SUB PUSH1 0x4 CALLDATALOAD AND PUSH1 0x24 CALLDATALOAD PUSH2 0x4DD JUMP JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x221 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x18A PUSH1 0x1 PUSH1 0xA0 PUSH1 0x2 EXP SUB PUSH1 0x4 CALLDATALOAD AND PUSH2 0x5CD JUMP JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x242 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0xC8 PUSH2 0x5E8 JUMP JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x257 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x161 PUSH1 0x1 PUSH1 0xA0 PUSH1 0x2 EXP SUB PUSH1 0x4 CALLDATALOAD AND PUSH1 0x24 CALLDATALOAD PUSH2 0x61F JUMP JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x27B JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x161 PUSH1 0x1 PUSH1 0xA0 PUSH1 0x2 EXP SUB PUSH1 0x4 CALLDATALOAD AND PUSH1 0x24 CALLDATALOAD PUSH2 0x700 JUMP JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x29F JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x18A PUSH1 0x1 PUSH1 0xA0 PUSH1 0x2 EXP SUB PUSH1 0x4 CALLDATALOAD DUP2 AND SWAP1 PUSH1 0x24 CALLDATALOAD AND PUSH2 0x799 JUMP JUMPDEST PUSH1 0x40 DUP1 MLOAD DUP1 DUP3 ADD SWAP1 SWAP2 MSTORE PUSH1 0xA DUP2 MSTORE PUSH32 0x5544415020546F6B656E00000000000000000000000000000000000000000000 PUSH1 0x20 DUP3 ADD MSTORE DUP2 JUMP JUMPDEST CALLER PUSH1 0x0 DUP2 DUP2 MSTORE PUSH1 0x2 PUSH1 0x20 SWAP1 DUP2 MSTORE PUSH1 0x40 DUP1 DUP4 KECCAK256 PUSH1 0x1 PUSH1 0xA0 PUSH1 0x2 EXP SUB DUP8 AND DUP1 DUP6 MSTORE SWAP1 DUP4 MSTORE DUP2 DUP5 KECCAK256 DUP7 SWAP1 SSTORE DUP2 MLOAD DUP7 DUP2 MSTORE SWAP2 MLOAD SWAP4 SWAP5 SWAP1 SWAP4 SWAP1 SWAP3 PUSH32 0x8C5BE1E5EBEC7D5BD14F71427D1E84F3DD0314C0F7B2291E5B200AC8C7C3B925 SWAP3 DUP3 SWAP1 SUB ADD SWAP1 LOG3 POP PUSH1 0x1 SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x1 SLOAD SWAP1 JUMP JUMPDEST PUSH1 0x0 PUSH1 0x1 PUSH1 0xA0 PUSH1 0x2 EXP SUB DUP4 AND ISZERO ISZERO PUSH2 0x374 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST PUSH1 0x1 PUSH1 0xA0 PUSH1 0x2 EXP SUB DUP5 AND PUSH1 0x0 SWAP1 DUP2 MSTORE PUSH1 0x20 DUP2 SWAP1 MSTORE PUSH1 0x40 SWAP1 KECCAK256 SLOAD DUP3 GT ISZERO PUSH2 0x399 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST PUSH1 0x1 PUSH1 0xA0 PUSH1 0x2 EXP SUB DUP5 AND PUSH1 0x0 SWAP1 DUP2 MSTORE PUSH1 0x2 PUSH1 0x20 SWAP1 DUP2 MSTORE PUSH1 0x40 DUP1 DUP4 KECCAK256 CALLER DUP5 MSTORE SWAP1 SWAP2 MSTORE SWAP1 KECCAK256 SLOAD DUP3 GT ISZERO PUSH2 0x3C9 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST PUSH1 0x1 PUSH1 0xA0 PUSH1 0x2 EXP SUB DUP5 AND PUSH1 0x0 SWAP1 DUP2 MSTORE PUSH1 0x20 DUP2 SWAP1 MSTORE PUSH1 0x40 SWAP1 KECCAK256 SLOAD PUSH2 0x3F2 SWAP1 DUP4 PUSH4 0xFFFFFFFF PUSH2 0x7C4 AND JUMP JUMPDEST PUSH1 0x1 PUSH1 0xA0 PUSH1 0x2 EXP SUB DUP1 DUP7 AND PUSH1 0x0 SWAP1 DUP2 MSTORE PUSH1 0x20 DUP2 SWAP1 MSTORE PUSH1 0x40 DUP1 DUP3 KECCAK256 SWAP4 SWAP1 SWAP4 SSTORE SWAP1 DUP6 AND DUP2 MSTORE KECCAK256 SLOAD PUSH2 0x427 SWAP1 DUP4 PUSH4 0xFFFFFFFF PUSH2 0x7D6 AND JUMP JUMPDEST PUSH1 0x1 PUSH1 0xA0 PUSH1 0x2 EXP SUB DUP1 DUP6 AND PUSH1 0x0 SWAP1 DUP2 MSTORE PUSH1 0x20 DUP2 DUP2 MSTORE PUSH1 0x40 DUP1 DUP4 KECCAK256 SWAP5 SWAP1 SWAP5 SSTORE SWAP2 DUP8 AND DUP2 MSTORE PUSH1 0x2 DUP3 MSTORE DUP3 DUP2 KECCAK256 CALLER DUP3 MSTORE SWAP1 SWAP2 MSTORE KECCAK256 SLOAD PUSH2 0x469 SWAP1 DUP4 PUSH4 0xFFFFFFFF PUSH2 0x7C4 AND JUMP JUMPDEST PUSH1 0x1 PUSH1 0xA0 PUSH1 0x2 EXP SUB DUP1 DUP7 AND PUSH1 0x0 DUP2 DUP2 MSTORE PUSH1 0x2 PUSH1 0x20 SWAP1 DUP2 MSTORE PUSH1 0x40 DUP1 DUP4 KECCAK256 CALLER DUP5 MSTORE DUP3 MSTORE SWAP2 DUP3 SWAP1 KECCAK256 SWAP5 SWAP1 SWAP5 SSTORE DUP1 MLOAD DUP7 DUP2 MSTORE SWAP1 MLOAD SWAP3 DUP8 AND SWAP4 SWAP2 SWAP3 PUSH32 0xDDF252AD1BE2C89B69C2B068FC378DAA952BA7F163C4A11628F55A4DF523B3EF SWAP3 SWAP2 DUP2 SWAP1 SUB SWAP1 SWAP2 ADD SWAP1 LOG3 POP PUSH1 0x1 SWAP4 SWAP3 POP POP POP JUMP JUMPDEST PUSH1 0x3 SLOAD PUSH1 0xFF AND DUP2 JUMP JUMPDEST CALLER PUSH1 0x0 SWAP1 DUP2 MSTORE PUSH1 0x2 PUSH1 0x20 SWAP1 DUP2 MSTORE PUSH1 0x40 DUP1 DUP4 KECCAK256 PUSH1 0x1 PUSH1 0xA0 PUSH1 0x2 EXP SUB DUP7 AND DUP5 MSTORE SWAP1 SWAP2 MSTORE DUP2 KECCAK256 SLOAD DUP1 DUP4 GT ISZERO PUSH2 0x532 JUMPI CALLER PUSH1 0x0 SWAP1 DUP2 MSTORE PUSH1 0x2 PUSH1 0x20 SWAP1 DUP2 MSTORE PUSH1 0x40 DUP1 DUP4 KECCAK256 PUSH1 0x1 PUSH1 0xA0 PUSH1 0x2 EXP SUB DUP9 AND DUP5 MSTORE SWAP1 SWAP2 MSTORE DUP2 KECCAK256 SSTORE PUSH2 0x567 JUMP JUMPDEST PUSH2 0x542 DUP2 DUP5 PUSH4 0xFFFFFFFF PUSH2 0x7C4 AND JUMP JUMPDEST CALLER PUSH1 0x0 SWAP1 DUP2 MSTORE PUSH1 0x2 PUSH1 0x20 SWAP1 DUP2 MSTORE PUSH1 0x40 DUP1 DUP4 KECCAK256 PUSH1 0x1 PUSH1 0xA0 PUSH1 0x2 EXP SUB DUP10 AND DUP5 MSTORE SWAP1 SWAP2 MSTORE SWAP1 KECCAK256 SSTORE JUMPDEST CALLER PUSH1 0x0 DUP2 DUP2 MSTORE PUSH1 0x2 PUSH1 0x20 SWAP1 DUP2 MSTORE PUSH1 0x40 DUP1 DUP4 KECCAK256 PUSH1 0x1 PUSH1 0xA0 PUSH1 0x2 EXP SUB DUP10 AND DUP1 DUP6 MSTORE SWAP1 DUP4 MSTORE SWAP3 DUP2 SWAP1 KECCAK256 SLOAD DUP2 MLOAD SWAP1 DUP2 MSTORE SWAP1 MLOAD SWAP3 SWAP4 SWAP3 PUSH32 0x8C5BE1E5EBEC7D5BD14F71427D1E84F3DD0314C0F7B2291E5B200AC8C7C3B925 SWAP3 SWAP2 DUP2 SWAP1 SUB SWAP1 SWAP2 ADD SWAP1 LOG3 POP PUSH1 0x1 SWAP4 SWAP3 POP POP POP JUMP JUMPDEST PUSH1 0x1 PUSH1 0xA0 PUSH1 0x2 EXP SUB AND PUSH1 0x0 SWAP1 DUP2 MSTORE PUSH1 0x20 DUP2 SWAP1 MSTORE PUSH1 0x40 SWAP1 KECCAK256 SLOAD SWAP1 JUMP JUMPDEST PUSH1 0x40 DUP1 MLOAD DUP1 DUP3 ADD SWAP1 SWAP2 MSTORE PUSH1 0x3 DUP2 MSTORE PUSH32 0x5550580000000000000000000000000000000000000000000000000000000000 PUSH1 0x20 DUP3 ADD MSTORE DUP2 JUMP JUMPDEST PUSH1 0x0 PUSH1 0x1 PUSH1 0xA0 PUSH1 0x2 EXP SUB DUP4 AND ISZERO ISZERO PUSH2 0x636 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST CALLER PUSH1 0x0 SWAP1 DUP2 MSTORE PUSH1 0x20 DUP2 SWAP1 MSTORE PUSH1 0x40 SWAP1 KECCAK256 SLOAD DUP3 GT ISZERO PUSH2 0x652 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST CALLER PUSH1 0x0 SWAP1 DUP2 MSTORE PUSH1 0x20 DUP2 SWAP1 MSTORE PUSH1 0x40 SWAP1 KECCAK256 SLOAD PUSH2 0x672 SWAP1 DUP4 PUSH4 0xFFFFFFFF PUSH2 0x7C4 AND JUMP JUMPDEST CALLER PUSH1 0x0 SWAP1 DUP2 MSTORE PUSH1 0x20 DUP2 SWAP1 MSTORE PUSH1 0x40 DUP1 DUP3 KECCAK256 SWAP3 SWAP1 SWAP3 SSTORE PUSH1 0x1 PUSH1 0xA0 PUSH1 0x2 EXP SUB DUP6 AND DUP2 MSTORE KECCAK256 SLOAD PUSH2 0x6A4 SWAP1 DUP4 PUSH4 0xFFFFFFFF PUSH2 0x7D6 AND JUMP JUMPDEST PUSH1 0x1 PUSH1 0xA0 PUSH1 0x2 EXP SUB DUP5 AND PUSH1 0x0 DUP2 DUP2 MSTORE PUSH1 0x20 DUP2 DUP2 MSTORE PUSH1 0x40 SWAP2 DUP3 SWAP1 KECCAK256 SWAP4 SWAP1 SWAP4 SSTORE DUP1 MLOAD DUP6 DUP2 MSTORE SWAP1 MLOAD SWAP2 SWAP3 CALLER SWAP3 PUSH32 0xDDF252AD1BE2C89B69C2B068FC378DAA952BA7F163C4A11628F55A4DF523B3EF SWAP3 DUP2 SWAP1 SUB SWAP1 SWAP2 ADD SWAP1 LOG3 POP PUSH1 0x1 SWAP3 SWAP2 POP POP JUMP JUMPDEST CALLER PUSH1 0x0 SWAP1 DUP2 MSTORE PUSH1 0x2 PUSH1 0x20 SWAP1 DUP2 MSTORE PUSH1 0x40 DUP1 DUP4 KECCAK256 PUSH1 0x1 PUSH1 0xA0 PUSH1 0x2 EXP SUB DUP7 AND DUP5 MSTORE SWAP1 SWAP2 MSTORE DUP2 KECCAK256 SLOAD PUSH2 0x734 SWAP1 DUP4 PUSH4 0xFFFFFFFF PUSH2 0x7D6 AND JUMP JUMPDEST CALLER PUSH1 0x0 DUP2 DUP2 MSTORE PUSH1 0x2 PUSH1 0x20 SWAP1 DUP2 MSTORE PUSH1 0x40 DUP1 DUP4 KECCAK256 PUSH1 0x1 PUSH1 0xA0 PUSH1 0x2 EXP SUB DUP10 AND DUP1 DUP6 MSTORE SWAP1 DUP4 MSTORE SWAP3 DUP2 SWAP1 KECCAK256 DUP6 SWAP1 SSTORE DUP1 MLOAD SWAP5 DUP6 MSTORE MLOAD SWAP2 SWAP4 PUSH32 0x8C5BE1E5EBEC7D5BD14F71427D1E84F3DD0314C0F7B2291E5B200AC8C7C3B925 SWAP3 SWAP1 DUP2 SWAP1 SUB SWAP1 SWAP2 ADD SWAP1 LOG3 POP PUSH1 0x1 SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x1 PUSH1 0xA0 PUSH1 0x2 EXP SUB SWAP2 DUP3 AND PUSH1 0x0 SWAP1 DUP2 MSTORE PUSH1 0x2 PUSH1 0x20 SWAP1 DUP2 MSTORE PUSH1 0x40 DUP1 DUP4 KECCAK256 SWAP4 SWAP1 SWAP5 AND DUP3 MSTORE SWAP2 SWAP1 SWAP2 MSTORE KECCAK256 SLOAD SWAP1 JUMP JUMPDEST PUSH1 0x0 DUP3 DUP3 GT ISZERO PUSH2 0x7D0 JUMPI INVALID JUMPDEST POP SWAP1 SUB SWAP1 JUMP JUMPDEST DUP2 DUP2 ADD DUP3 DUP2 LT ISZERO PUSH2 0x7E3 JUMPI INVALID JUMPDEST SWAP3 SWAP2 POP POP JUMP STOP LOG1 PUSH6 0x627A7A723058 KECCAK256 0x2a 0x24 0x2c PUSH6 0xCA2B91E11F66 0xb1 0xbd 0xd7 PC 0xa8 0xd3 0xce 0xd4 SWAP15 0xea PUSH14 0x4655B8B31FD7E8A8C7DB37002900 ",
        "sourceMap": "7469:319:0:-;;;7597:26;;;-1:-1:-1;;7597:26:0;7621:2;7597:26;;;7630:153;5:2:-1;;;;30:1;27;20:12;5:2;7630:153:0;;;;;;;;;;;;;;;;7726:8;;;;7712:2;:23;7695:40;7726:8;7680:55;;;7751:10;7726:8;7742:20;;;7630:153;7742:20;;;;;;;:35;7469:319;;;;;;"
    };

    let contractData = upxContract.new.getData("10000000000",{data:"0x"+byteCode.object});

    let gasPrice = web3.eth.gasPrice;
    let nonce = web3.eth.getTransactionCount(ethereumCfg.address);

    let rawTx = {
        from:ethereumCfg.address,
        nonce: web3.toHex(nonce),
        gasPrice: web3.toHex(gasPrice),
        value: '0x00',
        data: contractData
    };
//estimateGas
    let gasEstimate = web3.eth.estimateGas(rawTx);
    rawTx.gasLimit=web3.toHex(gasEstimate);
    let tx = new Tx(rawTx);
    tx.sign(privateKey);
    let serializedTx = tx.serialize();
    return new Promise((resolve,reject) => {
        web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), (err, hash) => {
            if (!err){
                console.log(hash);
                web3.eth.getTransactionReceipt(hash,(err, receipt) => {
                    if (err)
                        console.log(err);
                    else
                        console.log(receipt);
                });
            }else
                console.log(err);
        });
    }).catch((err)=>{
        throw err;
    })
};

let transEthToMe =()=>{
    if(web3.isConnected()){
        let accounts = web3.eth.accounts;
        if (accounts.length == 0){
            console.log("没有账户。。。");
            return;
        }
        let balance = web3.eth.getBalance(accounts[0]);
        let fees = web3.toWei('0.01', 'ether');
        if (balance - fees > 0){
            let param = {
                from:accounts[0],
                to:"0x9e23bf76901ad8f2dc4f9557e4e7e2529991cc09",
                value:89*Math.pow(10,18).toString()
            };
            web3.eth.sendTransaction(param, function(err, transactionHash) {
                if (!err)
                    console.log("转账成功，交易事务，",transactionHash); // "0x7f9fade1c0d57a7af66ab4ead7c2eb7b11a91385"
            });
        }else {
            console.log("余额太小===", web3.fromWei(balance, 'ether').toString(),"ether"); // instanceof BigNumber
        }
    }else {
        console.log("未连接节点。。。")
    }
};


const newAssert =  (typeAddr,to,uri) =>{
    let abi = standardAsset_artifacts.abi;
    let standardAsset = web3.eth.contract(abi).at(typeAddr);
    let data = standardAsset.mint.getData(to,uri);

    let gasPrice = web3.eth.gasPrice;
    let nonce = web3.eth.getTransactionCount(ethereumCfg.address);

    let rawTx = {
        from:ethereumCfg.address,
        to:typeAddr,
        nonce: web3.toHex(nonce),
        gasPrice: web3.toHex(gasPrice),
        value: '0x00',
        data: data
    };
    //estimateGas
    let gasEstimate = web3.eth.estimateGas(rawTx);
    rawTx.gasLimit=web3.toHex(gasEstimate);
    let tx = new Tx(rawTx);
    tx.sign(privateKey);
    let serializedTx = tx.serialize();
    let txHash = new Promise((resolve,reject) => {
        web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), (err, hash) => {
            if (err)
                console.log(err);
            else
                console.log(hash);
        });
    }).catch(err=>{throw err;});
    return txHash;
};

web3.eth.getTransactionReceipt("0x50a26e702ab0244f29f2588047b7371e611200ec6cf1834c8be0aa6dae926e98",(err, receipt) => {
    if (err)
        console.log(err);
    else
        console.log(receipt);
});


newAssert("0xfecbfdc6f7dc8c9df23bdddff45c368f0f90a95a","0xcabe9a163b96865308605bde13233fd1a0610931","https://ipfs.io/api/v0/dag/get?arg=zdpuAo6w1qzcp5XuEkfsU8VPq9bWoobNPZfb7Ynz366eVpb1k")




