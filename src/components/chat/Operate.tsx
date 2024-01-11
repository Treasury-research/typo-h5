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
  useToast
} from "@chakra-ui/react";

import { ChatChildren, ChatList } from "lib/types";
import { useStore } from "store";
import { useEffect, useMemo, useState } from "react";
import moment from "moment";
import { LongPressTouch } from "components";
import { Popup, Dialog, Picker } from "react-vant";
import useChatContext from "hooks/useChatContext";

export function Operate({
  item,
  index,
  children,
}: any) {
  const { setInput, submitMessage, activeChat, activeChatId, removeMessage,isGenerate } = useChatContext()
  const showToast = useToast();
  const [isOpen, setIsOpen] = useBoolean(false);
  const { onCopy } = useClipboard(item.content as string);

  const isLastLeftChat = useMemo(() => {
    if (!activeChat) return false;
    return index === activeChat?.messages.length;
  }, [activeChat, index]);

  const lastUserInput = useMemo(() => {
    if (!activeChat) return undefined;
    const rightItems = activeChat?.messages.filter((item: any) => item.type === "question");
    return rightItems[0]?.content || undefined;
  }, [activeChat]);

  const showActions = useMemo(() => {
    const actions = ["Delete"];

    if (item.type === "result" && isLastLeftChat && lastUserInput) {
      actions.unshift("Regen");
    }

    if (!["profile", "ens", "poap", "snapshot"].includes(item?.tool || "")) {
      actions.unshift("Copy");
    }

    return actions;
  }, [item, isLastLeftChat, lastUserInput]);

  const deleteLastLeftChat = () => {
    removeMessage(activeChat.id, item.id)
  };

  const regen = () => {
    setInput && setInput((lastUserInput as string) || "");
    deleteLastLeftChat();
    submitMessage({ isReGenerate: true });
  };

  const onPickerChange = (action: any) => {
    if (action === "Copy") {
      showToast({
        position: 'top',
        title: 'Copied',
        variant: 'subtle',
      })
      onCopy();
    } else if (action === "Delete") {
      Dialog.confirm({
	title: "Delete",
	confirmButtonText: "Confirm",
	cancelButtonText: "Cancel",
	message: "Are you sure to delete this content?",
      }).then(() => {
        removeMessage(activeChat.id, item.id)
      });
    } else if (action === "Regen") {
      regen();
    }

    setIsOpen.off();
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
	const wrapperElement = document.querySelector(
	  ".rv-picker-column__wrapper"
	);
	const childElements = wrapperElement?.children;

	if (childElements && childElements?.length > 0) {
	  childElements[0].textContent = "Select";
	}
      }, 200);
    }
  }, [isOpen]);

  return (
    <LongPressTouch
      isOpen={isOpen}
      onOpen={setIsOpen.on}
      PressArea={
	<Popup
	  round
	  position="bottom"
	  style={{ paddingBottom: "40px" }}
	  visible={isOpen}
	  onClose={setIsOpen.off}
	>
	  <Picker
	  showToolbar={true}
	  title="Operate"
	  columns={showActions}
	  confirmButtonText="Confirm"
	  cancelButtonText="Cancel"
	  onConfirm={onPickerChange}
	  onCancel={setIsOpen.off}
	  />
	</Popup>
      }
    >
      <Flex
	w="full"
	pos="relative"
	gap={2}
	justify={item.type === "question" ? "flex-end" : "flex-start"}
      >
	{children}
	{item.type != "question" && (
	  <Text
	    mt={1}
	    color="gray.400"
	    fontSize="12px"
	    pos="absolute"
	    left="48px"
	    bottom="-20px"
	  >
	    {moment(Number(item.createTime)).fromNow()}
	  </Text>
	)}
      </Flex>
    </LongPressTouch>
  );
}
