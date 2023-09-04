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
} from "@chakra-ui/react";

import { ChatChildren, ChatList } from "lib/types";
import { HiOutlineEllipsisVertical } from "react-icons/hi2";
import { RiDeleteBinLine } from "react-icons/ri";

import { BiCopy } from "react-icons/bi";
import { BsArrowRepeat } from "react-icons/bs";
import { useStore } from "store";
import { deepClone } from "lib";
import { useMemo, useState } from "react";
import moment from "moment";

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
	const [isMouseOver, setIsMouseOver] = useBoolean(false);
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

	return (
		<>
			<Flex
				w="full"
				pos="relative"
				gap={2}
				onMouseOver={setIsMouseOver.on}
				onMouseLeave={setIsMouseOver.off}
				cursor="pointer"
				justify={item.type === "nl" ? "flex-end" : "flex-start"}
			>
				{item.type != "nl" && (
					<>
						{children}
						{isMouseOver && (
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
					</>
				)}

				{isMouseOver && (
					<Flex
						h="35px"
						flexDir={item.type === "nl" ? "inherit" : "row-reverse"}
						alignItems="center"
					>
						<Popover placement="bottom" flip={false}>
							<PopoverTrigger>
								<Flex
									w="20px"
									h="35px"
									justify="center"
									alignItems="center"
									pos="relative"
								>
									<Icon
										mt={0}
										as={HiOutlineEllipsisVertical}
										color="gray.500"
										cursor="pointer"
										boxSize={7}
									/>
								</Flex>
							</PopoverTrigger>
							<Portal>
								<PopoverContent
									bg="bg.main"
									w="110px"
									mt="-6px"
									boxShadow="none!"
									onMouseOver={setIsMouseOver.on}
								>
									<PopoverArrow bg="bg.main" />
									<PopoverBody px={0} py={1}>
										{item.tool != "profile" && (
											<HStack
												w="full"
												_hover={{ bg: "gray.300" }}
												cursor="pointer"
												pl={4}
												py={1}
												onClick={() => {
													showToast("Copied", "success");
													onCopy();
													setIsMouseOver.off();
												}}
											>
												<Icon as={BiCopy} color="bg.green" boxSize={4} />
												<Text>Copy</Text>
											</HStack>
										)}
										<HStack
											w="full"
											_hover={{ bg: "gray.300" }}
											cursor="pointer"
											pl={4}
											py={1}
											onClick={() => {
												const copyList: ChatList[] = deepClone(list);
												copyList[chatIndex].children.splice(index, 1);
												setList(copyList);
												setIsMouseOver.off();
											}}
										>
											<Icon as={RiDeleteBinLine} color="bg.green" boxSize={4} />
											<Text>Delete</Text>
										</HStack>
										{item.type === "result" &&
											isLastLeftChat &&
											lastUserInput && (
												<HStack
													w="full"
													_hover={{ bg: "gray.300" }}
													cursor="pointer"
													pl={4}
													py={1}
													onClick={regen}
												>
													<Icon
														as={BsArrowRepeat}
														color="bg.green"
														boxSize={4}
													/>
													<Text>Regen</Text>
												</HStack>
											)}
										{/* {item.id && (
										<HStack
											w="full"
											_hover={{ bg: "gray.300" }}
											cursor="pointer"
											pl={4}
											py={1}
											onClick={() => {
												if (!item.submit) {
													ButtonClickTrace("Submit");
													setShowModal.on();
												}
											}}
										>
											<Icon
												as={GoChecklist}
												color={item.submit ? "gray.400" : "bg.green"}
												boxSize={4}
											/>
											<Text color={item.submit ? "gray.400" : ""}>
												{item.submit ? "Submited" : "Submit"}
											</Text>
										</HStack>
									)} */}
									</PopoverBody>
								</PopoverContent>
							</Portal>
						</Popover>
					</Flex>
				)}
				{item.type === "nl" && children}
			</Flex>
		</>
	);
}
