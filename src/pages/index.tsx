
import Chat from 'components/chat'
import ChatProvider from 'components/chat/Context'

export default function Home() {
  return (
    <ChatProvider>
      <Chat />
    </ChatProvider>
  )
}
