import { expect } from "chai";
import { ethers } from "hardhat";
import { Ballot } from "../typechain-types";

const PROPOSALS = ["Proposal 1", "Proposal 2", "Proposal 3"]; 

describe("Ballot", () => {
    let ballotContract: Ballot;

    beforeEach(async () => {
        const ballotContractFactory = await ethers.getContractFactory("Ballot");
        ballotContract = await ballotContractFactory.deploy(
            PROPOSALS.map((prop) => ethers.utils.formatBytes32String(prop))
        );
        await ballotContract.deployed();
    });

    describe("when the contract is deployed", () => {
        it("has the provided proposals", async () => {
            for (let i = 0; i < PROPOSALS.length; i++) {
                const proposal = await ballotContract.proposals(i);
                expect(ethers.utils.parseBytes32String(proposal.name))
                    .to.eq(PROPOSALS[i]);
            };
        });

        it("has 0 votes for all proposals", async () => {
            for (let i = 0; i < PROPOSALS.length; i++) {
                const proposal = await ballotContract.proposals(i);
                expect(proposal.voteCount).to.eq(0);
            };
        });

        it("should set the deployer as the chairperson", async () => {
            const signers = await ethers.getSigners();
            const deployerAddress = signers[0].address;
            const chairperson = await ballotContract.chairperson();
            expect(chairperson).to.eq(deployerAddress);
        });

        it("sets the voting weight for the chairperson as 1", async () => {
            const chairperson = await ballotContract.chairperson();
            const voter = await ballotContract.voters(chairperson);
            expect(voter.weight).to.eq(1);
        });
    });
});