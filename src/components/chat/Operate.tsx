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
import { Popup, Dialog, Picker } from "react-vant";
import useChatContext from "hooks/useChatContext";
import { useQuoteStore } from "store/quoteStore";
import { useUserInfoStore } from "store/userInfoStore";

export function MessageActionSheet({ item, index, onClose }) {
  const {
    activeChat,
    removeMessage,
    isGenerate,
  } = useChatContext()
  const { userId } = useUserInfoStore();
  const { setIsShowInputQuote, setQuoteContent, setQuoteType } = useQuoteStore()
  const { onCopy } = useClipboard(item.content as string)
  const showToast = useToast();

  const quoteMessage = useCallback(() => {
    if(isGenerate){
      return;
    }
    if (!userId) {
      showToast("You're not logged in yet.", "warning");
      return;
    }
    if (activeChat && activeChat.isShare) {
      showToast("Please start your thread", "info");
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

  return (
    <>
      <Box width="100%" height="60px" display="flex" alignItems="center" justifyContent="center" fontSize="16ox" fontWeight="500" cursor="pointer" cursor="pointer" onClick={quoteMessage}>
        Quote
      </Box>
      <Box width="100%" height="60px" display="flex" alignItems="center" justifyContent="center" fontSize="16ox" fontWeight="500" borderTop="1px solid #D8D8D8" cursor="pointer" onClick={copyMessage}>
        Copy
      </Box>
      <Box width="100%" height="60px" display="flex" alignItems="center" justifyContent="center" fontSize="16ox" fontWeight="500" borderTop="1px solid #D8D8D8" cursor="pointer" onClick={deleteMessage}>
        Delete
      </Box>
      <Box width="100%" height="60px" display="flex" alignItems="center" justifyContent="center" borderTop="2px solid #D8D8D8" fontSize="16ox" fontWeight="500" cursor="pointer" onClick={onClose}>
        Cancel
      </Box>
    </>
  )
}

export function ShareActionSheet({ item, index }) {
  return (
    <>
      <Box width="100%" height="60px" display="flex" alignItems="center" justifyContent="center" fontSize="16ox" fontWeight="500">
        Quote
      </Box>
      <Box width="100%" height="60px" display="flex" alignItems="center" justifyContent="center" fontSize="16ox" fontWeight="500" borderTop="1px solid #D8D8D8">
        Copy
      </Box>
      <Box width="100%" height="60px" display="flex" alignItems="center" justifyContent="center" fontSize="16ox" fontWeight="500" borderTop="1px solid #D8D8D8">
        Delete
      </Box>
      <Box width="100%" height="60px" display="flex" alignItems="center" justifyContent="center" borderTop="2px solid #D8D8D8" fontSize="16ox" fontWeight="500">
        Cancel
      </Box>
    </>
  )
}

export function SourceActionSheet({ source, index, onClose, onPreview }) {
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
