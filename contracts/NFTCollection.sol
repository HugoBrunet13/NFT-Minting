// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTCollection is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    //_tokenIds variable has the most recent minted tokenId
    Counters.Counter private _tokenIds;
// Max number of NFT that can be minted
    uint256 public maxNFTs; 
    // Start timestamp of minting window
    uint256 public mintWindowStart;
    // End timestamp of minting window 
    uint256 public mintWindowEnd; 
    // Use to track if an address already minted
    mapping(address => bool) private _hasMinted;
    // Use to track what's the address of the owner of an NFT
    mapping(uint256 => address) private _idNftToOwer;

    // Constructor of the contract
    constructor(
        string memory name_,
        string memory symbol_,
        uint256 _maxNFTs,
        uint256 _mintWindowStart,
        uint256 _mintWindowEnd
    ) ERC721(name_, symbol_) {
        require(
            isTimeWindowValid(_mintWindowStart, _mintWindowEnd),
            "Invalid time window"
        );
        require(_maxNFTs > 0, "Invalid maxNFT value");
        maxNFTs = _maxNFTs;
        mintWindowStart = _mintWindowStart;
        mintWindowEnd = _mintWindowEnd;
    }

    // Function that return boolean is the given time window is valid
    function isTimeWindowValid(
        uint256 startTime,
        uint256 endTime
    ) private view returns (bool) {
        uint256 currentTime = block.timestamp;
        return startTime < endTime && currentTime < endTime;
    }

    // Mint NFT function
    // This function only accept a tokenURI which will contain the metadata
    function mintNFT(string memory tokenURI) public returns (uint) {
        require(
            isTimeWindowValid(mintWindowStart, mintWindowEnd),
            "Minting window has closed"
        );
        require(!_hasMinted[msg.sender], "You have already minted an NFT");
        require(_tokenIds.current() < maxNFTs, "All NFTs have been minted");

        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);

        _hasMinted[msg.sender] = true;
        _idNftToOwer[newTokenId] = msg.sender;

        emit Minted(newTokenId, tokenURI);

        return newTokenId;
    }

    // Get last minted NFT ID
    function getCurrentToken() public view returns (uint256) {
        return _tokenIds.current();
    }

    // //Returns NFT ID that the current user is owner
    function getMyNFT() public view returns (uint256) {
        uint totalItemCount = _tokenIds.current();

        for (uint i = 0; i < totalItemCount; i++) {
            if (_idNftToOwer[i + 1] == msg.sender) {
                return i + 1;
            }
        }
        return 0;
    }

    event Minted(uint256 tokenId, string tokenURI);
}
