// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

/**
 * @title TBAP Reward NFT contract
 * @dev Extends ERC721 Non-Fungible Token Standard basic implementation
 * @author Agustín Alberca
 * @author Juan Ignacio Borrelli
 */


contract RewardToken is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable {
    //using keywords
    using Strings for uint256;
    using Counters for Counters.Counter;

    //structs
    struct TokenData {
        string title;
        uint16 issuerId;
        uint256 createdAt;
    }

    mapping(uint256 => TokenData) public rewards;
    mapping(uint256 => bool) public usedNonces;

    //variables
    Counters.Counter private _tokenIdCounter;
    address public immutable signer;
    string public baseTokenURI;

    //events
    event NewReward(address indexed owner, uint256 indexed tokenId, TokenData tokenData);

    constructor(address _signer, string memory _baseTokenURI) 
        ERC721("Reward Token", "TBAP") 
    {
        signer = _signer;
        baseTokenURI = _baseTokenURI;
    }

    //modifiers
    modifier validTitle(string memory title) {
        uint256 titleLength = utfStringLength(title);
        require(titleLength <= 256, "Title is too long");
        require(titleLength > 0, "Title cannot be blank");
        _;
    }

    modifier consumeNonce(uint256 nonce) {
        require(!usedNonces[nonce], "Signature already used");
        usedNonces[nonce] = true;
        _;
    }

    //https://ethereum.stackexchange.com/questions/13862/is-it-possible-to-check-string-variables-length-inside-the-contract
    function utfStringLength(string memory str) 
        internal pure returns (uint256 length) 
    {
        uint256 i = 0;
        bytes memory string_rep = bytes(str);

        while (i < string_rep.length) {
        if (string_rep[i] >> 7 == 0)
            i += 1;
        else if (string_rep[i] >> 5 == bytes1(uint8(0x6)))
            i += 2;
        else if (string_rep[i] >> 4 == bytes1(uint8(0xE)))
            i += 3;
        else if (string_rep[i] >> 3 == bytes1(uint8(0x1E)))
            i += 4;
        else
            //For safety
            i += 1;

        length++;
        }
    }

    //minting methods
    function _mint(address beneficiary, string calldata title, uint16 issuerId, string calldata uri) 
        internal 
    {
        uint256 createdAt = block.timestamp;
        TokenData memory tData = TokenData(
        title,
        issuerId,
        createdAt
        );

        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(beneficiary, tokenId);
        _setTokenURI(tokenId, uri);
        rewards[tokenId] = tData;
        emit NewReward(beneficiary, tokenId, tData);
    }

    function mintGift(address beneficiary, string calldata title, uint16 issuerId, string calldata uri)
        external onlyOwner validTitle(title)
    {
        _mint(beneficiary, title, issuerId, uri);
    }

    function mint(string calldata title, uint16 issuerId, uint256 nonce, string calldata uri, bytes calldata signature ) 
        external validTitle(title) consumeNonce(nonce)
    {
        bytes32 hashData = keccak256(abi.encodePacked(title, issuerId, nonce, uri, address(this)));
        bytes32 message = ECDSA.toEthSignedMessageHash(hashData);
        require(ECDSA.recover(message,signature) == signer, "Invalid backend signature. Mint not allowed.");
        _mint(msg.sender, title, issuerId, uri);
    }
    //contract getters
    function getUserRewards(address user) 
        external view returns (uint256[] memory, TokenData[] memory) 
    {
        uint256 userBalance = balanceOf(user);
        uint256[] memory userRewardIds = new uint256[](userBalance);
        TokenData[] memory userRewards = new TokenData[](userBalance);

        for (uint256 i = 0; i < userBalance; i++) {
            uint256 rewardId = tokenOfOwnerByIndex(user, i);
            (string memory title, uint16 issuerId, uint256 createdAt) = getRewardOverview(rewardId);

            userRewards[i] = TokenData(title, issuerId, createdAt);
            userRewardIds[i] = rewardId;
        }

        return (userRewardIds, userRewards);
    }

    function getRewardOverview(uint256 tokenId) 
        public view returns (string memory, uint16, uint256)
    {
        return (
        rewards[tokenId].title,
        rewards[tokenId].issuerId,
        rewards[tokenId].createdAt
        );
    }

    function renounceOwnership()
        public view override onlyOwner 
    {
        revert("Can't renounceOwnership here"); //not possible with this smart contract
    }

    // The following functions are overrides required by Solidity.
    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
        internal override(ERC721, ERC721Enumerable)
    {
        require(from == address(0) || to == address(0), "Token ownership is non transferrable");
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function _burn(uint256 tokenId) 
        internal override(ERC721, ERC721URIStorage) 
    {
        super._burn(tokenId);
    }

    function _baseURI() internal view override returns (string memory) {
        return baseTokenURI;
    }

    function tokenURI(uint256 tokenId)
        public view override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        require(_exists(tokenId), "ERC721URIStorage: URI query for nonexistent token");
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public view 
        override(ERC721, ERC721Enumerable, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}