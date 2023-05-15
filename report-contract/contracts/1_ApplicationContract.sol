// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.0 <0.9.0;

contract ApplicationContract {
    struct Application {
        string id;
        string subject;
        string description;
        string file;
        address applierAddress;
        uint256 votes;
    }

    mapping(string => Application) public applications;
    mapping(address => string[]) public applicationsMadeByAddress;
    mapping(address => uint256) public rewardBank;
    string[] allApplications;

    function create(
        string memory id,
        string memory subject,
        string memory description,
        string memory file
    ) public {
        Application memory a;
        a.id = id;
        a.subject = subject;
        a.description = description;
        a.applierAddress = msg.sender;
        a.file = file;
        a.votes = 0;

        applications[id] = a;
        applicationsMadeByAddress[msg.sender].push(id);

        allApplications.push(id);
    }


    // function to view appication
    function getApplication(string memory id) public view returns (Application memory) {
        return applications[id];
    }

    function getApplicationsMadeByAddress() public view returns(string[] memory){
        return applicationsMadeByAddress[msg.sender];
    }

    function getAllApplicationsID() public view returns(string[] memory){
        return allApplications;
    }


    // reward system
    function addUpvote(string memory id, uint256 amount) payable public{
        // require(msg.value == amount);
        // require(amount <= address(msg.sender).balance);


        rewardBank[ applications[id].applierAddress ] += amount;

        Application memory a = applications[id];
        a.votes += 1;
        applications[a.id] = a;
    }

    function getBalance() public view returns (uint256) {
        return rewardBank[msg.sender];
    }

    function withdraw() payable public {
        address payable user = payable(msg.sender);
        user.transfer( rewardBank[msg.sender] );
    }

    // test function to see your own ID
    function getID() public view returns(address){
        return msg.sender;
    }

}