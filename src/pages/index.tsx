
import { NextSeo } from 'components';
import Chat from 'components/chat'
import ChatProvider from 'components/chat/Context'

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
