//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

/**
 * @title TBAP Reward NFT contract
 * @author Agustín Alberca
 */
contract Reward is ERC721Enumerable, Ownable {
  using Strings for uint256;
  using Strings for uint16;

  struct TokenData {
    string title;
    uint16 issuerId;
    uint256 createdAt;
  }

  mapping(uint256 => TokenData) public rewards;
  mapping(uint256 => bool) public usedNonces;
  uint256 private _idSeq;

  address public immutable signer;
  string public baseTokenURI;

  event NewReward(address indexed owner, uint256 indexed tokenId, TokenData tokenData);

  constructor(address _signer)
    ERC721("Reward Token", "TBAP")
  {
    signer = _signer;
    baseTokenURI = "";
  }


  modifier validTitle(string memory title) {
    uint256 titleLength = utfStringLength(title);
    require(titleLength <= 256, "Title is too long");
    require(titleLength > 0, "Name cannot be blank");
    _;
  }

  modifier consumeNonce(uint256 nonce) {
    require(!usedNonces[nonce], "Signature already used");
    usedNonces[nonce] = true;
    _;
  }

  //https://ethereum.stackexchange.com/questions/13862/is-it-possible-to-check-string-variables-length-inside-the-contract
  function utfStringLength(string memory str) 
    pure internal returns (uint256 length) 
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

  /**
   * @dev See {IERC721Metadata-tokenURI}.
   */
  function tokenURI(uint256 tokenId) 
    public view virtual override returns (string memory) 
  {
    require(_exists(tokenId), "Nonexistent token");

    string memory baseURI = _baseURI();
    (, uint16 issuerId, ) = getRewardOverview(tokenId);
    return bytes(baseURI).length > 0 ? string(abi.encodePacked(baseURI, issuerId)) : "";
  }

  /**
   * @dev See {ERC721-_baseURI}.
   */
  function _baseURI() 
    internal view override returns (string memory) 
  {
    return baseTokenURI;
  }

  /**
   * @dev Sets the base token URI prefix.
   */
  function setBaseTokenURI(string memory _baseTokenURI) 
    external onlyOwner 
  {
    baseTokenURI = _baseTokenURI;
  }

  function _mint(address beneficiary, string calldata title, uint16 issuerId) 
    internal 
  {
    uint256 createdAt = block.timestamp;
    
    TokenData memory tData = TokenData(
      title,
      issuerId,
      createdAt
    );

    rewards[++_idSeq] = tData;

    _safeMint(beneficiary, _idSeq);
    emit NewReward(beneficiary, _idSeq, tData);
  }

  function mintGift(address beneficiary, string calldata title, uint16 issuerId)
    external onlyOwner 
  {
    _mint(beneficiary, title, issuerId);
  }

  function mint(string calldata title, uint16 issuerId, uint256 nonce, bytes calldata signature ) 
    external validTitle(title) consumeNonce(nonce)
  {
    bytes32 message = keccak256(abi.encodePacked(msg.sender, title, issuerId, nonce, address(this)));
    require(ECDSA.recover(message,signature) == signer, "Invalid backend signature. Mint not allowed.");

    _mint(msg.sender, title, issuerId);
  }

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

  function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
    internal virtual override(ERC721Enumerable)
  {
    require(from == address(0) || to == address(0), "NonTransferrableERC721Token: non transferrable");
    super._beforeTokenTransfer(from, to, tokenId, batchSize);
  }
}
