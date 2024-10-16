// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/Address.sol";
import "@chainlink/contracts/src/v0.8/vrf/dev/libraries/VRFV2PlusClient.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import {ConfirmedOwner} from "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";
import {VRFV2PlusWrapperConsumerBase} from "@chainlink/contracts/src/v0.8/vrf/dev/VRFV2PlusWrapperConsumerBase.sol";
import {LinkTokenInterface} from "@chainlink/contracts/src/v0.8/shared/interfaces/LinkTokenInterface.sol";
import {VRFV2PlusClient} from "@chainlink/contracts/src/v0.8/vrf/dev/libraries/VRFV2PlusClient.sol";
import {VRFConsumerBaseV2Plus} from "@chainlink/contracts/src/v0.8/vrf/dev/VRFConsumerBaseV2Plus.sol";

contract Feedback is VRFConsumerBaseV2Plus {
    // Voting properties
    mapping(address => mapping(string => uint)) public itemVotes; // total project votes within the current cycle
    mapping(address => mapping(address => mapping(string => bool))) public hasVotedOnItem;

    // Voting Events
    event Voted(address voterAddress, address receiverAddress, string itemId);
    // event Commented(address voter, string itemId, string commentLink, uint receiverAddress);
    // event Reviewed(address voter, string itemId, string reviewLink, uint receiverAddress);
    event WinnerAnnounced(address winner, uint256 amount, uint cycle);

    // Chainlink VRF properties
    uint256 s_subscriptionId;
    address vrfCoordinator;
    bytes32 private keyHash;
    uint32 private callbackGasLimit = 100000; // Adjust the gas limit based on the requirement
    uint16 private requestConfirmations = 3; // Minimum number of confirmations
    uint32 private numWords =  1; // Number of random values to request
    uint256[] public requestIds;
    uint256 public lastRequestId;
    struct RequestStatus {
        bool fulfilled; // whether the request has been successfully fulfilled
        bool exists; // whether a requestId exists
        uint256[] randomWords;
    }
    mapping(uint256 => RequestStatus)
    public s_requests;

    // Chainlink VRF Events
    event RequestSent(uint256 requestId, uint32 numWords);
    event RequestFulfilled(uint256 requestId, uint256[] randomWords);

    constructor(address _vrfCoordinator, uint256 _subscriptionId, bytes32 _keyHash) VRFConsumerBaseV2Plus(_vrfCoordinator) {
        s_subscriptionId = _subscriptionId;
        keyHash = _keyHash;
    }

    function subscriptionSet() public view returns (bool) {
        uint256 length = 0;
        return s_subscriptionId != length;
    }

    function vrfCoordinatorSet() public view returns (address) {
        return vrfCoordinator;
    }

    function keyHashSet() public view returns (bytes32) {
        return keyHash;
    }

    // function rewardProviders(address[] winners) public {
    //     require(bytes(winners).length < 3, "There must be at least 3 winners.")
    //     // TODO: distribute rewards
    // }

    function vote(string memory itemId, string memory displayName, address receiverAddress) public {
        require(!hasVotedOnItem[msg.sender][receiverAddress][itemId], "address already voted on item");
        hasVotedOnItem[msg.sender][receiverAddress][itemId] = true;
        itemVotes[receiverAddress][itemId]++;
        emit Voted(msg.sender, receiverAddress, itemId);
    }

    function registerReward(uint prize, address receiverAddress, string[] memory itemIds) public payable {

    }

    function distributeReward() public {
        require(msg.sender
    }

    // TODO: maybe this could implemented where the proviers send a link
    // function comment() public {

    // }

    // TODO: maybe this could be implemented where the provider sends a link
    // function review() public {

    // }

    function getItemVoteCount(string memory itemId, address receiverAddress) public view returns (uint) {
        return itemVotes[receiverAddress][itemId];
    }

    function checkHasVoted(string memory itemId, address receiverAddress) public view returns (bool) {
        return hasVotedOnItem[msg.sender][receiverAddress][itemId];
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function requestRandomWords(
        bool enableNativePayment
    ) internal returns (uint256 requestId) {
        requestId = s_vrfCoordinator.requestRandomWords(
            VRFV2PlusClient.RandomWordsRequest({
                keyHash: keyHash,
                subId: s_subscriptionId,
                requestConfirmations: requestConfirmations,
                callbackGasLimit: callbackGasLimit,
                numWords: numWords,
                extraArgs: VRFV2PlusClient._argsToBytes(
                    VRFV2PlusClient.ExtraArgsV1({
                        nativePayment: enableNativePayment
                    })
                )
            })
        );
        s_requests[requestId] = RequestStatus({
            randomWords: new uint256[](0),
            exists: true,
            fulfilled: false
        });
        requestIds.push(requestId);
        lastRequestId = requestId;
        emit RequestSent(requestId, numWords);
        return requestId;
    }

    function getRequestStatus(
        uint256 _requestId
    ) external view returns (bool fulfilled, uint256[] memory randomWords) {
        require(s_requests[_requestId].exists, "request not found");
        RequestStatus memory request = s_requests[_requestId];
        return (request.fulfilled, request.randomWords);
    }

    // pick random winner once threshold is met for the current vote cycle
    function fulfillRandomWords(uint256 _requestId, uint256[] calldata _randomWords) internal override {
        require(s_requests[_requestId].exists, "request not found");
        s_requests[_requestId].fulfilled = true;
        s_requests[_requestId].randomWords = _randomWords;
        emit RequestFulfilled(_requestId, _randomWords);
        uint256 randomResult = _randomWords[0];
    }
}
