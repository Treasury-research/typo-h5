import { useContext } from "react";
import { ChatContext } from "components/chat/Context";

export default function useChatContext() {
  return useContext<any>(ChatContext);
}
