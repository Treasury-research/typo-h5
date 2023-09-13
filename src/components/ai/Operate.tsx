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
} from "@chakra-ui/react";

import { ChatChildren, ChatList } from "lib/types";
import { useStore } from "store";
import { deepClone } from "lib";
import { useEffect, useMemo, useState } from "react";
import moment from "moment";
import { LongPressTouch } from "components";
import { Popup, Dialog, Picker } from "react-vant";

export function Operate({
	item,
	index,
	chatIndex,
	list,
	children,
	setInput,
	setList,
	onSend,
}: {
	item: ChatChildren;
	index: number;
	chatIndex: number;
	list: ChatList[];
	children?: React.ReactElement | React.ReactElement[];
	setInput?: (value: string) => void;
	onSend?: (isReGenerate?: boolean) => void;
	setList: (value: ChatList[]) => void;
}) {
	const { showToast } = useStore();
	const [isOpen, setIsOpen] = useBoolean(false);
	const { onCopy } = useClipboard(item.content as string);

	const isLastLeftChat = useMemo(() => {
		const child = list[chatIndex].children;
		return index === child.length - 1;
	}, [item, chatIndex, index, list]);

	const lastUserInput = useMemo(() => {
		const copyList: ChatList[] = deepClone(list);
		const child = copyList[chatIndex].children;
		const rightItems = (child.reverse() || []).filter(
			(item) => item.type === "nl"
		);
		return rightItems[0]?.content || undefined;
	}, [item, chatIndex, list]);

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
		const copyList: ChatList[] = deepClone(list);
		copyList[chatIndex].children.splice(index, 1);
		setList(copyList);
	};

	const regen = () => {
		setInput && setInput((lastUserInput as string) || "");
		deleteLastLeftChat();
		onSend && onSend(true);
	};

	const onPickerChange = (action: any) => {
		if (action === "Copy") {
			showToast("Copied", "success");
			onCopy();
		} else if (action === "Delete") {
			Dialog.confirm({
				title: "Delete",
				confirmButtonText: "Confirm",
				cancelButtonText: "Cancel",
				message: "Are you sure to delete this content?",
			}).then(() => {
				const copyList: ChatList[] = deepClone(list);
				copyList[chatIndex].children.splice(index, 1);
				setList(copyList);
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
				justify={item.type === "nl" ? "flex-end" : "flex-start"}
			>
				{children}
				{item.type != "nl" && (
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
