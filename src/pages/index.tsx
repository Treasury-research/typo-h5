import Chat from "components/chat";
import ChatProvider from "components/chat/Context";
import { NextSeo } from "components";

export default function Home() {
	return (
		<>
			<NextSeo title={"TypoX AI"} />
			<ChatProvider>
				<Chat />
			</ChatProvider>
		</>
	);
}
