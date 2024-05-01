import { Address } from "viem";

export interface ChainInfo {
        chainId: number;
        name: string;
        isTest: boolean;
        imgUrl: string;
        UContract: Address;
        RedeemContract: Address | null;
        NftLevelContract?: Address;
        browser: string;
        // abi: string[];
}
interface ChainConfig {
        [key: number]: ChainInfo;
}

export const chainList: ChainConfig = {
        80001: {
                chainId: 80001,
                name: "Mumbai",
                imgUrl: "https://chainlist.org/unknown-logo.png",
                isTest: true,
                UContract: "0xC666283f0A53C46141f509ed9241129622013d95",
                RedeemContract: "0x33d908cde07994e9be10f94344ce6667fb1f0900",
                NftLevelContract: "0x0b14ff34ccea03c2ffb7b6194c0fe5d0788041d0",
                browser: "https://mumbai.polygonscan.com",
        },
        97: {
                chainId: 97,
                name: "BSCTest",
                imgUrl: "https://icons.llamao.fi/icons/chains/rsz_binance.jpg",
                isTest: true,
                UContract: "0xbF1dF7Eb88FfCBe8b54cF7dE070A2A6b94dbe44d",
                RedeemContract: "0x1698Dc1EBd90D77792e137802521a3bB06880Db2",
                browser: "https://testnet.bscscan.com",
        },

        42161: {
                chainId: 42161,
                name: "Arbitrum",
                imgUrl: "https://icons.llamao.fi/icons/chains/rsz_arbitrum.jpg",
                isTest: false,
                UContract: "0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9",
                RedeemContract: "0xfBD2Eba77Ce936471f7219C4F84444141e95301e",
                NftLevelContract: "0x6ca3AE33c818Ce9B2be40333f9D2d3639cBc1135",
                browser: "https://arbiscan.io",
        },
        137: {
                chainId: 137,
                name: "Polygon",
                imgUrl: "https://icons.llamao.fi/icons/chains/rsz_polygon.jpg",
                isTest: false,
                UContract: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
                RedeemContract: "0x955f8c8aefdb364708eba19363708ac9105c68de",
                browser: "https://polygonscan.com",
        },
};
