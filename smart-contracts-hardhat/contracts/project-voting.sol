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

struct FeedbackBundle {
    address owner;
    uint256 rewardBalance;
    uint settleDeadline;
    bool isSettled;
}

contract Feedback is VRFConsumerBaseV2Plus {
    // Voting properties
    mapping(address => mapping(string => string)) public itemFeedback;
    mapping(address => mapping(string => bool)) public hasProvidedFeedback;
    mapping(string => address[]) public itemFeedbackProviders;
    mapping(string => FeedbackBundle) public feedbackBundles;

    // Voting Events
    event FeedbackProvided(address providerAddress, string itemId);
    event RewardSettled(address providerAddress, uint256 amount);

    // Chainlink VRF properties
    uint256 s_subscriptionId;
    address vrfCoordinator;
    bytes32 private keyHash;
    uint32 private callbackGasLimit = 100000; // Adjust the gas limit based on the requirement
    uint16 private requestConfirmations = 3; // Minimum number of confirmations
    uint32 private numWords =  1; // Number of random values to request
    uint256[] public requestIds;
    uint256 public lastRequestId;
    mapping(address => mapping(string => address)) private s_bundleSettlements;
    mapping(uint256 => string) private s_randomBundleSettlements;
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

    function provideFeedback(string memory itemId, string memory feedbackId) public {
        require(!hasProvidedFeedback[msg.sender][itemId], "address has already provided feedback on item");
        hasProvidedFeedback[msg.sender][itemId] = true;
        itemFeedback[msg.sender][itemId] = feedbackId;
        itemFeedbackProviders[itemId].push(msg.sender);
        emit FeedbackProvided(msg.sender, itemId);
    }

    function addFeedbackBundle(string memory _itemId, uint256 _rewardBalance, uint _settleDeadline) public payable {
        feedbackBundles[_itemId] = FeedbackBundle(msg.sender, _rewardBalance, _settleDeadline, false);
    }

    function getFeedbackBundle(string memory _itemId) public view returns (address, uint256, uint, bool) {
       FeedbackBundle memory bundle = feedbackBundles[_itemId];
       return (bundle.owner, bundle.rewardBalance, bundle.settleDeadline, bundle.isSettled);
    }

    function settleReward(address payable providerAddress, string memory itemId) public {
        FeedbackBundle memory bundle = feedbackBundles[itemId];
        require(!bundle.isSettled, "bundle already settled");
        require(bundle.owner == msg.sender, "only bundle owner can send reward");
        uint256 rewardAmount = bundle.rewardBalance;
        providerAddress.transfer(rewardAmount);
    }

    function settleRewardRandomly(string memory itemId) public {
        FeedbackBundle memory bundle = feedbackBundles[itemId];
        require(!bundle.isSettled, "item id does not exist or owner is invalid.");
        require(bundle.settleDeadline > block.timestamp);
        chooseRandomProvider(itemId);
    }

    function checkHasFeedback(string memory itemId) public view returns (bool) {
        return hasProvidedFeedback[msg.sender][itemId];
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function chooseRandomProvider(string memory itemId) internal returns (uint256 requestId) {
        requestId = s_vrfCoordinator.requestRandomWords(
            VRFV2PlusClient.RandomWordsRequest({
                keyHash: keyHash,
                subId: s_subscriptionId,
                requestConfirmations: requestConfirmations,
                callbackGasLimit: callbackGasLimit,
                numWords: numWords,
                extraArgs: VRFV2PlusClient._argsToBytes(
                    VRFV2PlusClient.ExtraArgsV1({
                        nativePayment: false
                    })
                )
            })
        );
        s_randomBundleSettlements[requestId] = itemId;
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

    function fulfillRandomWords(uint256 _requestId, uint256[] calldata _randomWords) internal override {
        require(s_requests[_requestId].exists, "request not found");
        s_requests[_requestId].fulfilled = true;
        s_requests[_requestId].randomWords = _randomWords;
        emit RequestFulfilled(_requestId, _randomWords);
        string memory itemId = s_randomBundleSettlements[_requestId];
        uint256 randomIndex = _randomWords[0] % itemFeedbackProviders[itemId].length;
        address payable winner = payable(itemFeedbackProviders[itemId][randomIndex]);
        uint256 rewardAmount = feedbackBundles[itemId].rewardBalance;
        winner.transfer(rewardAmount);
    }
}
