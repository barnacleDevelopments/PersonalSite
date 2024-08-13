// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/utils/Address.sol";
import "@chainlink/contracts/src/v0.8/vrf/dev/libraries/VRFV2PlusClient.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import {ConfirmedOwner} from "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";
import {VRFV2PlusWrapperConsumerBase} from "@chainlink/contracts/src/v0.8/vrf/dev/VRFV2PlusWrapperConsumerBase.sol";
import {LinkTokenInterface} from "@chainlink/contracts/src/v0.8/shared/interfaces/LinkTokenInterface.sol";
import {VRFV2PlusClient} from "@chainlink/contracts/src/v0.8/vrf/dev/libraries/VRFV2PlusClient.sol";
import {VRFConsumerBaseV2Plus} from "@chainlink/contracts/src/v0.8/vrf/dev/VRFConsumerBaseV2Plus.sol";

contract ProjectVoting is VRFConsumerBaseV2Plus {
    // Voting mappings
    mapping(uint => mapping(string => uint)) public cycleVotes; // total project votes within the current cycle
    mapping(uint => mapping(address => string)) public addressCycleChoice; // address project choice for the currrent cycle
    mapping(uint => mapping(address => bool)) public hasVotedForCycle; // has the address voted for a project in the current cycle
    mapping(uint => address[]) public cycleVoters; // list of voters of the current cycle
    mapping(address => string) public addressNames; // address display names
    mapping(string => string) public projects;

    uint private threshold = 0.1 ether;
    uint public currentCycle = 1;

    // Chainlink VRF Variables
    uint256 s_subscriptionId;
    bytes32 private keyHash;
    uint32 private callbackGasLimit = 100000; // Adjust the gas limit based on the requirement
    uint16 private requestConfirmations = 3; // Minimum number of confirmations
    uint32 private numWords =  1; // Number of random values to request

    // Voting Events
    event ProjectAdded(string projectId, string projectName);
    event Voted(address voter, string name, string projectId, uint cycle);
    event WinnerAnnounced(address winner, uint256 amount, uint cycle);

    // User Action Events
    event ActionPerformed(address voter, string[] actionCIDs);

    // Chainlink VRF Events
    event RequestSent(uint256 requestId, uint32 numWords);
    event RequestFulfilled(uint256 requestId, uint256[] randomWords);

    // Chainlink VRF Past Request IDs.
    uint256[] public requestIds;
    uint256 public lastRequestId;

    struct RequestStatus {
        bool fulfilled; // whether the request has been successfully fulfilled
        bool exists; // whether a requestId exists
        uint256[] randomWords;
    }

    mapping(uint256 => RequestStatus)

    public s_requests;

    constructor(address _vrfCoordinator, uint256 _subscriptionId, bytes32 _keyHash) VRFConsumerBaseV2Plus(_vrfCoordinator) {
        s_subscriptionId = _subscriptionId;
        keyHash = _keyHash;
    }

    function add(string memory projectName, string memory projectId) public onlyOwner {
        require(bytes(projects[projectId]).length == 0, "Project already exists");
        require(bytes(projectName).length > 0, "Project name is required");
        require(bytes(projectId).length > 0, "Project ID is required"); 
        projects[projectId] = projectName;
        emit ProjectAdded(projectId, projectName);
    }

    function vote(string memory projectId, string memory voterName) payable public {
        require(msg.value >= 0.001 ether, "Minimum 0.001 ether");
        require(msg.value <= 0.05 ether, "Maximum 0.05 ether");
        bool hasVoted = hasVotedForCycle[currentCycle][msg.sender];
        require(!hasVoted, "Already voted");
        require(bytes(projects[projectId]).length > 0, "Project does not exist"); 
        addressCycleChoice[currentCycle][msg.sender] = projectId;
        cycleVotes[currentCycle][projectId]++;
        hasVotedForCycle[currentCycle][msg.sender] = true;
        cycleVoters[currentCycle].push(msg.sender);
        checkAndTransfer();
        emit Voted(msg.sender, voterName, projectId, currentCycle);
    }

    function getCycleVoteCount(string memory projectId) public view returns (uint) {
        return cycleVotes[currentCycle][projectId];
    }

    function checkHasVotedForCycle() public view returns (bool) {
        return hasVotedForCycle[currentCycle][msg.sender];
    }

    function getVoteCycleChoice() public view returns (string memory) {
        return addressCycleChoice[currentCycle][msg.sender];
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function getThreshold() public view returns (uint256) {
        return threshold;
    }

    function requestRandomWords(
        bool enableNativePayment
    ) internal onlyOwner returns (uint256 requestId) {
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

    function checkAndTransfer() internal {
        if (address(this).balance >= threshold) {
            require(cycleVoters[currentCycle].length > 0, "No voters to reward");
            requestRandomWords(false);
        }
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
        uint randomIndex = randomResult % cycleVoters[currentCycle].length;
        address payable luckyVoter = payable(cycleVoters[currentCycle][randomIndex]);
        uint256 amountToSend = address(this).balance;
        emit WinnerAnnounced(luckyVoter, amountToSend, currentCycle);
        luckyVoter.transfer(amountToSend);
        currentCycle++;
    }
}
