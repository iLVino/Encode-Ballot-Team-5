import { ethers, Wallet } from "ethers";
import * as dotenv from "dotenv";
import { Ballot__factory } from "../typechain-types";
dotenv.config();

// CONTRACT ADDRESS: 0xDAd4B5E3f5Fa7e346B45594F96A25d7A2b1604dC

async function main() {
    const provider = new ethers.providers.AlchemyProvider(
        "goerli",
        process.env.ALCHEMY_API_KEY
    );
    
    const privateKey = process.env.PRIVATE_KEY;
    if(!privateKey || privateKey.length <= 0) 
        throw new Error("Missing environment: PRIVATE_KEY");
    
    const wallet = new Wallet(privateKey);
    const signer = wallet.connect(provider);
    const balance = await signer.getBalance()
    console.log(`The account has ${balance} Wei`);

    const args = process.argv;

    const contractAddress = args[2];
    if(!contractAddress || contractAddress.length <= 0) 
        throw new Error("Missing argument: contract addresses");
    
    const proposalNum = args[3];
    if (!proposalNum || proposalNum.length <= 0) throw new Error("Missing argument: proposal");
    console.log(`Querying votes for proposal: ${proposalNum}`);

    const ballotContract = new Ballot__factory(signer).attach(contractAddress);
    console.log("Querying votes...");
    const proposal = await ballotContract.proposals(proposalNum);
    console.log(
        `Number of votes for proposal ${proposalNum}: ${proposal.voteCount}`
    );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});