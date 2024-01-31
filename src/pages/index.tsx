import Chat from "components/chat";
import ChatProvider from "components/chat/Context";
import { NextSeo } from "components";

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
