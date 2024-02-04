export interface KeyUsageData {
	key_name: string;
	key: string;
	request_counts: number | null;
}

export type KeyData = {
	created_at?: string;
	email: string;
	is_enabled: boolean;
	key: string;
	name: string;
	service: string;
};

export type DateString = `${number}-${number}-${number}`;

export type DateCount = {
	date: DateString;
	count: number;
};

export type ChatChildren = {
	error?: string;
	content: string | {};
	id?: string;
	tool?:
		| "profile"
		| "guide"
		| "langchain"
		| "chat"
		| "googleSearch"
		| "campaign"
		| "dataQuery"
		| "ens"
		| "poap"
		| "snapshot"
		| "dataChart"
		| "goplus"
		| "uniswap";
	createTime: number;
	submit?: "Submited" | false | undefined | null;
	type: "nl" | "result";
};

export type ChatList = {
	timestamp: number;
	name: string;
	children: ChatChildren[];
	chatId: string;
	type: string;
	isSandBox: boolean;
	// chatIndex?: number;
};

export type Incentive = {
	type:
		| "Login"
		| "Pre_Registration"
		| "Referral"
		| "Referee"
		| "Connect_Email"
		| "Typo_Hunter"
		| "TG"
		| "Substack"
		| "gallery_s1"
		| "gallery_s2"
		| "token2049"
		| "OlaGala"
		| "double_denier";

	score: number;
};
