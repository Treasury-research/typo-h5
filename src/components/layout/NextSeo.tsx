import type { ReactNode } from "react";
import Head from "next/head";
import { NextSeo as Seo } from "next-seo";
import { useRouter } from "next/router";
import useChatContext from "hooks/useChatContext";

type NextSeoProps = {
	title: string;
	description?: string;
	keywords?: string;
};

export const NextSeo = ({ title, description, keywords }: NextSeoProps) => {
	const router = useRouter();

	// console.log("activeChat", activeChat);

	return (
		<>
			<Head>
				<title>{title || "TypoGraphy AI"}</title>
				<meta
					name="viewport"
					content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover"
				/>
				<meta name="description" content={description || "Ai chart"} />
				<meta
					name="keywords"
					content={
						keywords ||
						"TypoGraphy, knn3-sdk, knn3, nft, web3, gpt, assignmet, metamask, api, sdk, blockchain, data service, openai, llm, workflow, event push"
					}
				/>
				<meta
					name="twitter:title"
					content="TypoGraphy AI: Unlocking Web3 Potential with AI"
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

				<meta name="twitter:card" content="summary_large_image" />
				<meta
					name="twitter:site"
					content={`${
						typeof window !== "undefined"
							? `${window.location.origin}/${router.query.id}`
							: ""
					}`}
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
			<Seo
				title={title}
				description={
					description || "A Web3 ChatGPT to make web3 accessible to all"
				}
				openGraph={{
					title,
					description,
				}}
			/>
		</>
	);
};
