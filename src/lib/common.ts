import { v4 as uuidv4 } from "uuid";
import { ethers } from "ethers";

const gateway = process.env.NEXT_PUBLIC_GATEWAY;

export const isProduction =
	typeof window !== "undefined" &&
	(window.location.href.includes("localhost") ||
		window.location.href.includes("staging"))
		? false
		: true;

export const toShortAddress = (address: string, maxLength = 16) => {
	if (!address) {
		address = "";
	}
	const tmpArr = address.split(".");
	const halfLength = Math.floor(maxLength / 2);
	const realAccount = tmpArr[0];
	if (realAccount.length <= maxLength) {
		return address;
	}
	return `${realAccount.substr(0, halfLength)}...${realAccount.substr(
		-halfLength
	)}${tmpArr[1] ? `.${tmpArr[1]}` : ""}`;
};

export const isPhone = () => {
	let flag =
		/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
			window.navigator?.userAgent
		);
	const ua: any = window.navigator.userAgent.toLowerCase();
	if (ua.match(/MicroMessenger/i) == "micromessenger") {
		flag = true;
	}

	return flag;
};

export const inWechat = () => {
	// 获取 User Agent
	const userAgent = navigator.userAgent.toLowerCase();
	// 判断是否在微信中打开
	if (userAgent.indexOf("micromessenger") !== -1) {
		return true;
	} else {
		return false;
	}
};

export const deepClone = (source: any) => {
	if (typeof source !== "object" || source == null) {
		return source;
	}
	const target: any = Array.isArray(source) ? [] : {};
	// eslint-disable-next-line no-restricted-syntax
	for (const key in source) {
		if (Object.prototype.hasOwnProperty.call(source, key)) {
			if (typeof source[key] === "object" && source[key] !== null) {
				target[key] = deepClone(source[key]);
			} else {
				target[key] = source[key];
			}
		}
	}
	return target;
};

export const isShortcut = (prompt: string) => {
	const regex = /^\/.*/;
	return regex.test(prompt);
};

export const getShortcutByprompt = (prompt: string) => {
	const array = prompt.split(" ");
	const cmd = array[0].toLocaleLowerCase();
	const cmdType = array[0].replace("/", "").toLocaleLowerCase();
	const cmdValue = array[1];
	return { cmd, cmdType, cmdValue };
};

export const isAddress = (address: string, input: string) => {
	const regular = /^0x[0-9a-fA-F]{40}$/;
	const eth = /\.eth$/;
	const bnb = /\.bnb$/;
	const lens = /\.lens$/;
	const bit = /\.bit$/;

	let flag = false;
	// const { type } = getShortcutByprompt(input.trim());

	// console.log(type, address);
	if (address === "my" || address === "My" || address === "MY") {
		flag = true;
	}
	if (regular.test(address)) {
		flag = true;
	}

	if (eth.test(address)) {
		flag = true;
	}

	if (bnb.test(address)) {
		flag = true;
	}
	if (lens.test(address)) {
		flag = true;
	}
	if (bit.test(address)) {
		flag = true;
	}
	if (address === "lensprotocol") {
		flag = true;
	}

	return flag;
};

export function base64(text: string) {
	const base64 = window.btoa(text);
	return base64.toString();
}

export function upFirst(str: string) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

export function getTopLevelDomain(url: string) {
	const match = url.match(
		/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:/\n]+)/im
	);
	if (match) {
		return match[1];
	}
	return null;
}

export function extractJSON(str: string) {
	let lastOpen, lastClose, candidate;
	lastClose = str.lastIndexOf("}");
	lastOpen = str.lastIndexOf("{");

	if (lastClose <= lastOpen || lastClose !== str.length - 1) {
		return { content: str };
	}

	candidate = str.substring(lastOpen, lastClose + 1);

	try {
		const res = JSON.parse(candidate);
		const text = str.substring(0, lastOpen);

		return {
			content: text,
			id: uuidv4(),
			...res,
		};
	} catch (e) {
		return { content: str };
	}
}

export function formatNumberWithCommas(number: number | string) {
	return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const getHash = async (tx_hash: string) => {
	try {
		const ethersProvider = new ethers.providers.Web3Provider(window.ethereum);
		const tranction = await ethersProvider.getTransaction(tx_hash);
		if (tranction) {
			return tranction;
		}
	} catch (error) {
		console.log("error", error);
	}
};


export function formatScore(score: string | number) {
	return parseFloat(String(score || 0)).toFixed(0);
}

export async function waitSeconds(number: number) {
	await new Promise((resolve) => setTimeout(resolve, number));
	console.log(`等待了${number}毫秒`);
}
