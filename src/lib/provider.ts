import { ethers } from 'ethers'

// Initialize provider outside component
export const provider = new ethers.JsonRpcProvider('https://data-seed-prebsc-1-s1.binance.org:8545/')

// export const contractPFXProvider =  async() =>  {

//     const contractPFX = "0x1b3f1f4f96d2c0e1d0a7e3c4d9f3f5c2b3b3f3c7";
// 	const gameContract = new ethers.Contract(contractPFX, GameABI.abi, provider);
// 	return gameContract;
// }