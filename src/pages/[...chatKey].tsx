import Chat from "components/chat";

import ChatProvider from "components/chat/Context";
import { isPhone } from "lib";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Home() {
	const router = useRouter();

	const query: any = router?.query?.chatKey;
	const id = query && query[1];

	useEffect(() => {
		const isphone = isPhone();
		console.log("isphone", isphone);
		if (!isphone ) {
			location.host.includes("staging")
				? router.push(
						id
							? `https://typography.staging.knn3.xyz/explorer/${id}`
							: `https://typography.staging.knn3.xyz/explorer`
				  )
				: router.push(
						id
							? `https://app.typography.vip/explorer/${id}`
							: "https://app.typography.vip/explorer"
				  );
		}
	}, [router]);
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
				<meta
					name="twitter:image"
					content="https://pic.imgdb.cn/item/65baf59c871b83018a01e5a9.png"
				/>
				<meta
					property="og:title"
					content="TypoGraphy AI: Unlocking Web3 Potential with AI"
				/>
				<meta
					property="og:image"
					content="https://pic.imgdb.cn/item/65baf59c871b83018a01e5a9.png"
				/>
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
