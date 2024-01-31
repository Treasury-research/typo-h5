import Chat from "components/chat";

import ChatProvider from "components/chat/Context";
import Head from "next/head";
import { useRouter } from "next/router";

export default function Home() {
	const router = useRouter();

	const query: any = router?.query?.chatKey;
	const id = query && query[1];

	// console.log("activeChat", router.query, id);
	return (
		<>
			<Head>
				<meta
					name="twitter:title"
					content="TypoGraphy AI: Unlocking Web3 Potential with AI"
				/>
				<meta name="twitter:card" content="summary_large_image" />
				<meta
					name="twitter:site"
					content={`${id ? `${location.origin}/${id}` : ""}`}
				/>
				<meta name="twitter:image" content="https://ibb.co/vhbnfty" />
				<meta
					property="og:title"
					content="TypoGraphy AI: Unlocking Web3 Potential with AI"
				/>
				<meta property="og:image" content="https://ibb.co/vhbnfty" />
				<meta
					property="og:description"
					content="Acquire Web3 expertise, stay on top of the latest developments, and explore Web3 protocols in your native language."
				/>

				<meta
					property="og:url"
					content={`${id ? `${location.origin}/${id}` : ""}`}
				/>
			</Head>
			<ChatProvider>
				<Chat />
			</ChatProvider>
		</>
	);
}
