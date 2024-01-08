import {
	Box,
	Text,
	Flex,
	HStack,
	Icon,
	Badge,
	Input,
	VStack,
} from "@chakra-ui/react";
import { deepClone } from "lib";
import { useEffect, useRef, useState } from "react";
import { ChatList } from "lib/types";
import { AiOutlineClear } from "react-icons/ai";
import { IoIosAdd, IoIosAddCircle } from "react-icons/io";
import { RiCopperCoinLine, RiDeleteBinLine } from "react-icons/ri";
import { FiEdit } from "react-icons/fi";
import { useUserInfoStore } from "store/userInfoStore";
import { useStore } from "store";
import { Cell, Dialog, Popover } from "react-vant";

export function Tabs({
	list,
	chatIndex,
	isSandBox,
	sandBoxType,
	setChatIndex,
	setList,
	addChannel,
	setInput,
	closeNav,
	setSandBoxType,
}: {
	list: ChatList[];
	chatIndex: number | null;
	isSandBox: boolean;
	sandBoxType: string;
	setInput: (value: string) => void;
	addChannel: () => void;
	setChatIndex: (value: number | null) => void;
	setList: (value: ChatList[]) => void;
	closeNav: () => void;
	setSandBoxType: (value: string) => void;
}) {
	const myTab = useRef<any>(null);
	const { showToast } = useStore();
	const { userId } = useUserInfoStore();

	const addChatChannel = () => {
		if (list.length >= 10) {
			showToast(`Maximum 10 channels`, "warning");
			return;
		}
		addChannel();
		onScroll();
	};

	const onScroll = () => {
		setTimeout(() => {
			myTab?.current &&
				myTab?.current?.scrollTo({
					top: 500,
					behavior: "smooth",
				});
		}, 100);
	};

	return (
		<VStack w="full" h="full" pos="relative" spacing={0}>
			<HStack w="full" justify="space-between" px={4} my={3}>
				<Text w="full" fontSize="md" fontWeight="semibold">
					{isSandBox ? "Sandbox" : "Chat"}
				</Text>
			</HStack>

			<VStack w="full" h="calc(100% - 40px)" alignItems="flex-start">
				<Box
					w="full"
					ref={myTab}
					overflowY="scroll"
					className="no-scrollbar"
					alignItems="flex-start"
					px={4}
				>
					{userId &&
						list.map((item: any, index: number) => {
							return (
								<Cell
									center
									key={index}
									title={
										<Flex id={`cell${index}`}>
											<Text fontSize="md" pl={1} pr={2}>
												#
											</Text>
											<Text
												flex={1}
												whiteSpace="nowrap"
												overflow="hidden"
												textOverflow="ellipsis"
												onClick={() => {
													setChatIndex(index);
													closeNav();
												}}
											>
												{item.name}
											</Text>
										</Flex>
									}
									isLink
									border={false}
									style={{
										background: "rgba(255, 255, 255, 0.12)",
										borderRadius: "5px",
										height: "42px",
										color: "#fff",
										marginBottom: "10px",
									}}
									rightIcon={
										<HStack color="#fff" fontSize="sm" pl={3}>
											<Icon
												as={FiEdit}
												boxSize={4}
												onClick={() => {
													let channelName = "";
													Dialog.confirm({
														title: "Edit Title",
														closeable: true,
														confirmButtonText: "Confirm",
														cancelButtonText: "Cancel",
														message: (
															<Input
																w="100%"
																textAlign="left"
																placeholder={list[index].name}
																autoFocus
																onChange={(e: any) =>
																	(channelName = e.target.value)
																}
															/>
														),
														onConfirm: () => {
															const copyList: ChatList[] = deepClone(list);
															copyList[index].name = channelName.trim();
															setList(copyList);
														},
													});
												}}
											/>

											<Icon
												as={AiOutlineClear}
												boxSize={4}
												onClick={() => {
													const copyList: ChatList[] = deepClone(list);
													Dialog.confirm({
														title: "Clear",
														confirmButtonText: "Confirm",
														cancelButtonText: "Cancel",
														message: "Are you sure to clear this chat?",
													}).then(() => {
														copyList[index].children = [];
														setList(copyList);
														showToast("Cleared successfully", "success");
													});
												}}
											/>

											<Icon
												as={RiDeleteBinLine}
												boxSize={4}
												onClick={() => {
													const copyList: ChatList[] = deepClone(list);
													Dialog.confirm({
														title: "Delete",
														confirmButtonText: "Confirm",
														cancelButtonText: "Cancel",
														message: "Are you sure to delete this chat?",
													}).then(() => {
														copyList.splice(index, 1);
														setChatIndex(null);
														setList(copyList);
													});
												}}
											/>
										</HStack>
									}
								/>
							);
						})}
				</Box>

				<Box px={4} w="full" h="40px">
					<HStack
						w="full"
						justify="space-between"
						fontWeight="semibold"
						h="full"
						fontSize="sm"
						borderRadius={6}
						px={2}
					>
						<Flex gap={2} flex={1} onClick={addChatChannel}>
							<Icon as={IoIosAdd} boxSize={5} />
							<Text> Add Chat</Text>
						</Flex>

						{isSandBox && (
							<Popover
								placement="bottom-end"
								actions={[{ text: "Regular" }]}
								onSelect={(option: any) => setSandBoxType(option.text)}
								reference={
									<Badge size="xs" mt={-1} colorScheme="green">
										{sandBoxType}
									</Badge>
								}
							/>
						)}
					</HStack>
				</Box>
			</VStack>
		</VStack>
	);
}
