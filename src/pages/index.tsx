import { NextSeo } from "components";
import Chat from "components/chat";
import ChatProvider from "components/chat/Context";
import Head from "next/head";
import { useRouter } from "next/router";

export default function Home() {
	return (
		<>
			<NextSeo title={"TypoGraphy AI"} />
			<ChatProvider>
				<Chat />
			</ChatProvider>
		</>
	);
}
