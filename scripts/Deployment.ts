import { ethers, Wallet } from "ethers";
import * as dotenv from "dotenv";
import { Ballot__factory } from "../typechain-types";
dotenv.config();

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
    const proposals = args.slice(2)
    if (proposals.length <= 0) throw new Error("Missing argument: proposals");
    console.log("Deploying Ballot contract");
    console.log("Proposals: ");
    proposals.forEach((element, index) => {
        console.log(`Proposal N. ${index + 1}: ${element}`);
    });
    
    const ballotContractFactory = new Ballot__factory(signer);
    console.log("Deploying Ballot contract...");
    const ballotContract = await ballotContractFactory.deploy(
        proposals.map((prop) => ethers.utils.formatBytes32String(prop))
    );
    const txReceipt = await ballotContract.deployTransaction.wait();
    console.log(
        `The ballot contract was deployed at ${ballotContract.address} in block number ${txReceipt.blockNumber}`
    )
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});