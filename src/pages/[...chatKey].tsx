import Chat from "components/chat";
import { NextSeo } from "components";
import ChatProvider from "components/chat/Context";

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
