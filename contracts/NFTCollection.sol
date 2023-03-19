// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFTCollection is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    uint256 public maxNFTs;
    uint256 public mintWindowStart;
    uint256 public mintWindowEnd;

    mapping(address => bool) private _hasMinted;

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

    function isTimeWindowValid(
        uint256 startTime,
        uint256 endTime
    ) private view returns (bool) {
        uint256 currentTime = block.timestamp;
        return currentTime >= startTime && currentTime < endTime;
    }

    function mintNFT(
        string memory name,
        string memory description,
        string memory image
    ) public {
        require(
            isTimeWindowValid(mintWindowStart, mintWindowEnd),
            "Minting window has closed"
        );
        require(!_hasMinted[msg.sender], "You have already minted an NFT");
        require(_tokenIds.current() < maxNFTs, "All NFTs have been minted");

        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        _safeMint(msg.sender, newTokenId);

        string memory metadata = string(
            abi.encodePacked(
                '{"name": "',
                name,
                '", ',
                '"description": "',
                description,
                '", ',
                '"image": "',
                image,
                '"}'
            )
        );
        _setTokenURI(newTokenId, metadata);

        _hasMinted[msg.sender] = true;

        emit Minted(newTokenId, name, description, image);
    }

    function hasMinted() public view returns (bool) {
        return _hasMinted[msg.sender];
    }

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    event Minted(
        uint256 tokenId,
        string name,
        string description,
        string image
    );
}
