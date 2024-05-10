import Chat from "components/chat";

import ChatProvider from "components/chat/Context";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import api, { baseURL } from "api";
import { isMobile } from "react-device-detect";

export async function getServerSideProps(context: any) {
	const { data } = await api.get(`/api/conversation/shared/image`, {
		params: {
			conversation_id: context.query.id,
		},
	});

	return {
		props: {
			shareImg: data,
		},
	};
}

export default function Home({ shareImg }: any) {
	const router = useRouter();

	const query: any = router?.query?.chatKey;
	const id = query && query[1];

	useEffect(() => {
		if (!isMobile && !location.host.includes("localhost")) {
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
					content={`${
						typeof window !== "undefined"
							? `${window.location.origin}/${router.query.id}`
							: ""
					}`}
				/>
				<meta name="twitter:image" content={shareImg} />
				<meta
					property="og:title"
					content="TypoGraphy AI: Unlocking Web3 Potential with AI"
				/>
				<meta property="og:image" content={shareImg} />
				<meta
					property="og:description"
					content="Acquire Web3 expertise, stay on top of the latest developments, and explore Web3 protocols in your native language."
				/>

				<meta
					property="og:url"
					content={`${
						typeof window !== "undefined"
							? `${window.location.origin}/${router.query.id}`
							: ""
					}`}
				/>
			</Head>
			<ChatProvider>
				<Chat />
			</ChatProvider>
		</>
	);
}
