import {
  PopoverTrigger,
  Popover,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  Flex,
  Icon,
  useBoolean,
  HStack,
  Text,
  useClipboard,
  Portal,
  VStack,
  useToast,
  Box
} from "@chakra-ui/react";
import { ChatChildren, ChatList } from "lib/types";
import { useStore } from "store";
import { useEffect, useMemo, useState, useCallback } from "react";
import moment from "moment";
import { LongPressTouch } from "components";
import TwitterIcon from "components/icons/Twitter";
import LinkIcon from "components/icons/Link";
import { Popup, Dialog, Picker } from "react-vant";
import useChatContext from "hooks/useChatContext";
import { useQuoteStore } from "store/quoteStore";
import { useUserInfoStore } from "store/userInfoStore";

export function MessageActionSheet({ item, index, onClose }: any) {
  const {
    activeChat,
    removeMessage,
    isGenerate,
  } = useChatContext()
  const { userId } = useUserInfoStore();
  const { setIsShowInputQuote, setQuoteContent, setQuoteType } = useQuoteStore()
  const { onCopy } = useClipboard(item.content as string)
  const [showDelete, setShowDelete] = useState(false)
  const showToast = useToast();

  const quoteMessage = useCallback(() => {
    if(isGenerate){
      return;
    }
    if (!userId) {
      showToast({
        position: 'top',
        title: `You're not logged in yet.`,
        variant: 'subtle',
        status: 'warning'
      })
      return;
    }
    if (activeChat && activeChat.isShare) {
      showToast({
        position: 'top',
        title: 'Please start your thread',
        variant: 'subtle',
        status: 'info'
      })
      return;
    }

    setIsShowInputQuote(true);
    setQuoteContent(
      (item.content) as string
    );
    setQuoteType("Chat");

    onClose()
  }, [item])

  const copyMessage = useCallback(() => {
    onCopy()
    showToast({
      position: 'top',
      title: 'Copied',
      variant: 'subtle',
    })
    onClose()
  }, [item])

  const deleteMessage = useCallback(() => {
    removeMessage(activeChat.id, item.id)
    onClose()
  }, [item, activeChat])

  const startDelete = useCallback(() => {
    setShowDelete(true)
  }, [])

  const endDelete = useCallback(() => {
    setShowDelete(false)
  }, [])

  if (showDelete) {
    return (
      <Box padding="24px">
        <Box fontSize="16px" fontWeight="700">
          Notice
        </Box>
        <Box fontSize="16px" fontWeight="500">
          Are you sure you want to delete this content? This operation is irreversible
        </Box>
        <Box width="100%" height="48px" display="flex" alignItems="center" justifyContent="center" fontSize="14ox" fontWeight="700" cursor="pointer" onClick={deleteMessage} borderRadius="6px" background="#357E7F" color="white" marginTop="10px">
          Confirm
        </Box>
        <Box width="100%" height="48px" display="flex" alignItems="center" justifyContent="center" fontSize="14ox" fontWeight="700" cursor="pointer" onClick={endDelete} borderRadius="6px" background="white" color="#357E7F" border="1px solid #357E7F" marginTop="10px">
          Cancel
        </Box>
      </Box>
    )
  }

  return (
    <>
      <Box width="100%" height="60px" display="flex" alignItems="center" justifyContent="center" fontSize="16ox" fontWeight="500" cursor="pointer" onClick={quoteMessage}>
        Quote
      </Box>
      <Box width="100%" height="60px" display="flex" alignItems="center" justifyContent="center" fontSize="16ox" fontWeight="500" borderTop="1px solid #D8D8D8" cursor="pointer" onClick={copyMessage}>
        Copy
      </Box>
      <Box width="100%" height="60px" display="flex" alignItems="center" justifyContent="center" fontSize="16ox" fontWeight="500" borderTop="1px solid #D8D8D8" cursor="pointer" onClick={startDelete}>
        Delete
      </Box>
      <Box width="100%" height="60px" display="flex" alignItems="center" justifyContent="center" borderTop="2px solid #D8D8D8" fontSize="16ox" fontWeight="500" cursor="pointer" onClick={onClose}>
        Cancel
      </Box>
    </>
  )
}

export function ShareActionSheet({ item, index, onClose }: any) {
  const { onCopy } = useClipboard(window.location.href)
  const [showCopy, setShowCopy] = useState(false)
  const showToast = useToast();

  const copyLink = useCallback(() => {
    onCopy()
    showToast({
      position: 'top',
      title: 'Copied',
      variant: 'subtle',
    })
    onClose()
  }, [item])

  const startCopy = useCallback(() => {
    setShowCopy(true)
  }, [])

  const endCopy = useCallback(() => {
    setShowCopy(false)
  }, [])

  if (showCopy) {
    return (
      <Box padding="24px">
        <Box fontSize="16px" fontWeight="700">
          Notice
        </Box>
        <Box fontSize="16px" fontWeight="500">
          Anyone who has access to a shared link can view and share the linked conversation. We encourage you not to share any sensitive content such as your wallet address, as anyone with the link can access the conversation or share the link with other people.
        </Box>
        <Box width="100%" height="48px" display="flex" alignItems="center" justifyContent="center" fontSize="14ox" fontWeight="700" cursor="pointer" onClick={copyLink} borderRadius="6px" background="#357E7F" color="white" marginTop="10px">
          OK
        </Box>
        <Box width="100%" height="48px" display="flex" alignItems="center" justifyContent="center" fontSize="14ox" fontWeight="700" cursor="pointer" onClick={endCopy} borderRadius="6px" background="white" color="#357E7F" border="1px solid #357E7F" marginTop="10px">
          Cancel
        </Box>
      </Box>
    )
  }

  return (
    <>
      <Box width="100%" fontWeight="500" fontSize="16px" display="flex" alignItems="center" justifyContent="center" marginBottom="10px">
        <Box>Share To</Box>
      </Box>
      <Box width="100%" display="flex" alignItems="center" justifyContent="space-around" marginBottom="20px" marginTop="20px">
        <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column">
          <Box marginBottom="10px">
            <TwitterIcon />
          </Box>
          <Box fontWeight="500" fontSize="16px">Twitter</Box>
        </Box>
        <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column" onClick={startCopy}>
          <Box marginBottom="10px">
            <LinkIcon />
          </Box>
          <Box fontWeight="500" fontSize="16px">Copy Link</Box>
        </Box>
      </Box>
    </>
  )
}

export function SourceActionSheet({ source, index, onClose, onPreview }: any) {
  const previewSource = useCallback(() => {
    if (onPreview) {
      onPreview()
    }

    onClose()
  }, [source])

  const openSource = useCallback(() => {
    window.open(source.link)
    onClose()
  }, [source])

  return (
    <>
      <Box width="100%" height="60px" display="flex" alignItems="center" justifyContent="center" fontSize="16ox" fontWeight="500" onClick={previewSource}>
        Preview
      </Box>
      <Box width="100%" height="60px" display="flex" alignItems="center" justifyContent="center" fontSize="16ox" fontWeight="500" borderTop="1px solid #D8D8D8" onClick={openSource}>
        Original Link
      </Box>
      <Box width="100%" height="60px" display="flex" alignItems="center" justifyContent="center" borderTop="2px solid #D8D8D8" fontSize="16ox" fontWeight="500" onClick={onClose}>
        Cancel
      </Box>
    </>
  )
}

export function Operate({
  children,
}: any) {
  const {
    setInput,
    submitMessage,
    activeChat,
    activeChatId,
    removeMessage,
    isGenerate,
    isActionSheetOpen,
    setIsActionSheetOpen,
    actionSheetProps
  } = useChatContext()
  const { type } = actionSheetProps
  // const showToast = useToast();
  // const [isOpen, setIsOpen] = useBoolean(false);
  /*
   *   console.log('item', item)
   *   const { onCopy } = useClipboard(item.content as string);
   *
   *   const isLastLeftChat = useMemo(() => {
   *     if (!activeChat) return false;
   *     return index === activeChat?.messages.length;
   *   }, [activeChat, index]);
   *
   *   const lastUserInput = useMemo(() => {
   *     if (!activeChat) return undefined;
   *     const rightItems = activeChat?.messages.filter((item: any) => item.type === "question");
   *     return rightItems[0]?.content || undefined;
   *   }, [activeChat]);
   *
   *   const showActions = useMemo(() => {
   *     const actions = ["Delete"];
   *
   *     if (item.type === "result" && isLastLeftChat && lastUserInput) {
   *       actions.unshift("Regen");
   *     }
   *
   *     if (!["profile", "ens", "poap", "snapshot"].includes(item?.tool || "")) {
   *       actions.unshift("Copy");
   *     }
   *
   *     return actions;
   *   }, [item, isLastLeftChat, lastUserInput]);
   *
   *   const deleteLastLeftChat = () => {
   *     removeMessage(activeChat.id, item.id)
   *   };
   *
   *   const regen = () => {
   *     setInput && setInput((lastUserInput as string) || "");
   *     deleteLastLeftChat();
   *     submitMessage({ isReGenerate: true });
   *   };
   *
   *   const onPickerChange = (action: any) => {
   *     if (action === "Copy") {
   *       showToast({
   *         position: 'top',
   *         title: 'Copied',
   *         variant: 'subtle',
   *       })
   *       onCopy();
   *     } else if (action === "Delete") {
   *       Dialog.confirm({
   *         title: "Delete",
   *         confirmButtonText: "Confirm",
   *         cancelButtonText: "Cancel",
   *         message: "Are you sure to delete this content?",
   *       }).then(() => {
   *         removeMessage(activeChat.id, item.id)
   *       });
   *     } else if (action === "Regen") {
   *       regen();
   *     }
   *
   *     setIsOpen.off();
   *   };
   *
   *   useEffect(() => {
   *     if (isOpen) {
   *       setTimeout(() => {
   *         const wrapperElement = document.querySelector(
   *           ".rv-picker-column__wrapper"
   *         );
   *         const childElements = wrapperElement?.children;
   *
   *         if (childElements && childElements?.length > 0) {
   *           childElements[0].textContent = "Select";
   *         }
   *       }, 200);
   *     }
   *   }, [isOpen]);
   *  */

  return (
    <LongPressTouch
      isOpen={isActionSheetOpen}
      onOpen={setIsActionSheetOpen.on}
      PressArea={
        <Popup
          round
          position="bottom"
          style={{  width: "calc(100%)" }}
          visible={isActionSheetOpen}
          onClose={setIsActionSheetOpen.off}
        >
          <Box>
            <Box height="30px" width="100%" display="flex" alignItems="center" justifyContent="center" marginBottom="10px">
              <Box height="4px" width="40px" background="#CCCCCC" />
            </Box>
            {type === 'message' && (
              <MessageActionSheet {...actionSheetProps} onClose={setIsActionSheetOpen.off} />
            )}
            {type === 'share' && (
              <ShareActionSheet {...actionSheetProps} onClose={setIsActionSheetOpen.off} />
            )}
            {type === 'source' && (
              <SourceActionSheet {...actionSheetProps} onClose={setIsActionSheetOpen.off} />
            )}
          </Box>
        </Popup>
      }
    >
      <Flex
        w="full"
        pos="relative"
        gap={2}
        background="transparent"
      >
        {children}
      </Flex>
    </LongPressTouch>
  );
}
