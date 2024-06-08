// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/vrf/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import {FunctionsClient} from "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/FunctionsClient.sol;"
import {ConfirmedOwner} from "@chainlink/contracts@/src/v0.8/shared/access/ConfirmedOwner.sol";
import {FunctionsRequest} from "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/libraries/FunctionsRequest.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract ProjectVoting is VRFConsumerBaseV2, ConfirmOwner, FunctionClient{
    
    // Voting Variables 
    mapping(string => uint) public projectVotes;
    mapping(address => bool) public hasVoted;
    mapping(string => string) public projects;
    mapping(address => string) public addressVotes;
    mapping(address => string) public addressNames;
    mapping(address => string[]) public addressActions;
    string[] public projectIds;
    address private owner;
    address[] private voters;
    uint private threshold = 0.1 ether;

    // Chainlink VRF Variables
    string private constant chooseWinnerFunction = "function performCalculation(input) {"
                                          "  // JavaScript logic here"
                                          "  return input * 2;" // Placeholder logic
                                          "}";

    VRFCoordinatorV2Interface COORDINATOR;
    uint64 private subscriptionId; // this can be found here https://vrf.chain.link/sepolia
    bytes32 private keyHash;
    uint32 private callbackGasLimit = 100000; // Adjust the gas limit based on the requirement
    uint16 private requestConfirmations = 3; // Minimum number of confirmations
    uint32 private numWords =  1; // Number of random values to request

    // Chainlink Functions Variables
    using FunctionsRequest for FunctionsRequest.Request;

    bytes32 public s_lastRequestId;
    bytes public s_lastResponse;
    bytes public s_lastError;

    error FunctionUnexpectedRequestID(bytes32 requestId);

    event FunctionResponse(bytes32 indexed requestId, bytes response, bytes err);

    // Voting Events
    event ProjectAdded(string projectId, string projectName);
    event Voted(address voter, string name, string projectId); 
    event WinnerAnnounced(address winner, uint256 amount);

    // User Action Events
    event ActionPerformed(address voter, string[] actionCIDs);

    // Chainlink VRF Events
    event RandomNumberRequested(uint256 requestId);
    event RandomNumberReceived(uint256 randomNumber);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can execute");
        _;
    }
  
    constructor(
        address _vrfCoordinator,
        uint64 _subscriptionId,
        bytes32 _keyHash,
        address router
    ) FunctionsClient(router) VRFConsumerBaseV2(_vrfCoordinator) {
        owner = msg.sender;
        subscriptionId = _subscriptionId;
        keyHash = _keyHash;
        COORDINATOR = VRFCoordinatorV2Interface(_vrfCoordinator);
    }

    function add(string memory projectName, string memory projectId) public onlyOwner {
        require(bytes(projects[projectId]).length == 0, "Project already exists");
        require(bytes(projectName).length > 0, "Project name is required");
        require(bytes(projectId).length > 0, "Project ID is required"); 
        projects[projectId] = projectName;
        projectIds.push(projectId);
        emit ProjectAdded(projectId, projectName); 
    }

    function vote(string memory projectId, string memory voterName) payable public {
        require(msg.value >= 0.001 ether, "Minimum 0.001 ether");
        require(msg.value <= 0.05 ether, "Maximum 0.05 ether");
        require(!hasVoted[msg.sender], "Already voted");
        require(bytes(projects[projectId]).length > 0, "Project does not exist"); 
        addressVotes[msg.sender] = projectId;
        projectVotes[projectId]++;
        hasVoted[msg.sender] = true;
        voters.push(msg.sender);
        checkAndTransfer();  
        emit Voted(msg.sender, voterName, projectId);
    }

    function voteTest() public payable returns (uint) {
        return msg.value;
    }

    function getVoteCount(string memory projectId) public view returns (uint) {
        return projectVotes[projectId];
    }

    function getAll() public view returns (string[] memory) {
        return projectIds;
    }

    function checkHasVoted() public view returns (bool) {
        return hasVoted[msg.sender];
    }

    function getVote() public view returns (string memory) {
        return addressVotes[msg.sender]; 
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function getThreshold() public view returns (uint256) {
        return threshold;
    }

    function getAddressAction() public view returns (string[] memory) {
        return addressActions[msg.sender];
    }

    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "New owner cannot be the zero address");
        owner = newOwner;
    }

    function checkAndTransfer() internal {
        if (address(this).balance >= threshold) {
            require(voters.length > 0, "No voters to reward");
            uint256 requestId = COORDINATOR.requestRandomWords(
                keyHash,
                subscriptionId,
                requestConfirmations,
                callbackGasLimit,
                numWords
            );
            emit RandomNumberRequested(requestId);
        }
    }

    function fulfillRandomWords(uint256 /* requestId */, uint256[] memory randomWords) internal override {
        uint256 randomResult = randomWords[0];
        emit RandomNumberReceived(randomWords[0]);
        uint randomIndex = randomResult % voters.length;

        sendRequest(chooseWinnerFunction, encryptedSecretsUrls, donHostedSecretsSlotID, donHostedSecretsVersion, args, bytesArgs, subscriptionId, gasLimit, donID);

        // Choose Voter Logic
        // address payable luckyVoter = payable(voters[randomIndex]);
        // uint256 amountToSend = address(this).balance;
        // emit WinnerAnnounced(luckyVoter, amountToSend);
        // luckyVoter.transfer(amountToSend);

    }

    function addActions(string[] memory actionCIDs) public {
        for(uint i = 0; i < actionCIDs.length; i++) {
            addressActions[msg.sender].push(actionCIDs[i]); 
        }
        emit ActionPerformed(msg.sender, actionCIDs);
    }

    function withdraw() public onlyOwner {
        payable(owner).transfer(address(this).balance);
    }

    /**
     * @notice Send a simple request
     * @param source JavaScript source code
     * @param encryptedSecretsUrls Encrypted URLs where to fetch user secrets
     * @param donHostedSecretsSlotID Don hosted secrets slotId
     * @param donHostedSecretsVersion Don hosted secrets version
     * @param args List of arguments accessible from within the source code
     * @param bytesArgs Array of bytes arguments, represented as hex strings
     * @param subscriptionId Billing ID
     */
    function sendRequest(
        string memory source,
        bytes memory encryptedSecretsUrls,
        uint8 donHostedSecretsSlotID,
        uint64 donHostedSecretsVersion,
        string[] memory args,
        bytes[] memory bytesArgs,
        uint64 subscriptionId,
        uint32 gasLimit,
        bytes32 donID
    ) external onlyOwner returns (bytes32 requestId) {
        FunctionsRequest.Request memory req;
        req.initializeRequestForInlineJavaScript(source);
        if (encryptedSecretsUrls.length > 0)
            req.addSecretsReference(encryptedSecretsUrls);
        else if (donHostedSecretsVersion > 0) {
            req.addDONHostedSecrets(
                donHostedSecretsSlotID,
                donHostedSecretsVersion
            );
        }
        if (args.length > 0) req.setArgs(args);
        if (bytesArgs.length > 0) req.setBytesArgs(bytesArgs);
        s_lastRequestId = _sendRequest(
            req.encodeCBOR(),
            subscriptionId,
            gasLimit,
            donID
        );
        return s_lastRequestId;
    }

    /**
     * @notice Store latest result/error
     * @param requestId The request ID, returned by sendRequest()
     * @param response Aggregated response from the user code
     * @param err Aggregated error from the user code or from the execution pipeline
     * Either response or error parameter will be set, but never both
     */
    function fulfillRequest(
        bytes32 requestId,
        bytes memory response,
        bytes memory err
    ) internal override {
        if (s_lastRequestId != requestId) {
            revert UnexpectedRequestID(requestId);
        }
        s_lastResponse = response;
        s_lastError = err;
        emit Response(requestId, s_lastResponse, s_lastError);
    }
}