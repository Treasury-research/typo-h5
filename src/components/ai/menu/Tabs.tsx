import { AddIcon, ChevronDownIcon } from "@chakra-ui/icons";
import {
	Box,
	Text,
	Flex,
	HStack,
	Icon,
	PopoverTrigger,
	Popover,
	PopoverContent,
	PopoverArrow,
	PopoverBody,
	PopoverCloseButton,
	Input,
	Tooltip,
	Badge,
	useBoolean,
	useDisclosure,
	Button,
	VStack,
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
} from "@chakra-ui/react";
import { deepClone } from "lib";
import { useRef, useState } from "react";
import { HiOutlineEllipsisVertical } from "react-icons/hi2";
import { ChatList } from "lib/types";
import { AiOutlineClear } from "react-icons/ai";
import { IoIosAdd, IoIosAddCircle } from "react-icons/io";
import { RiCopperCoinLine, RiDeleteBinLine } from "react-icons/ri";
import { FiEdit } from "react-icons/fi";
import { useUserInfoStore } from "store/userInfoStore";
import { useStore } from "store";
import { HiOutlineChatBubbleLeft } from "react-icons/hi2";

const TabItem = ({
	item,
	list,
	chatIndex,
	index,
	setChatIndex,
	setList,
}: {
	item: ChatList;
	list: ChatList[];
	index: number;
	chatIndex: number | null;
	setChatIndex: (value: number | null) => void;
	setList: (value: ChatList[]) => void;
}) => {
	const myInput = useRef<any>(null);
	const [name, setName] = useState("");
	const [readOnly, setReadOnly] = useBoolean(true);
	const { isOpen, onClose, onOpen } = useDisclosure();
	const [opt, setOpt] = useState<"delete" | "clear">("clear");

	return (
		<Popover isOpen={isOpen} onClose={onClose} placement="right" closeOnBlur>
			<PopoverTrigger>
				<Flex
					borderRadius={6}
					w="200px"
					px={2}
					h="40px"
					alignItems="center"
					justify="space-between"
					fontWeight="400"
					fontSize="sm"
					bg={index === chatIndex ? "blackAlpha.100" : ""}
					_hover={{ bg: "blackAlpha.200" }}
					onClick={() => setChatIndex(index)}
					cursor="pointer"
				>
					{/* <Icon as={HiOutlineChatBubbleLeft} boxSize={7} pl={1} pr={2} /> */}
					<Text fontSize="md" pl={1} pr={2}>
						#
					</Text>
					{readOnly ? (
						<Text
							flex={1}
							whiteSpace="nowrap"
							overflow="hidden"
							textOverflow="ellipsis"
							_hover={{ transform: "scale(1.01)" }}
						>
							{item.name}
						</Text>
					) : (
						<Input
							flex={1}
							ref={myInput}
							h="full"
							p={0}
							border="0"
							bg="transparent"
							cursor="pointer"
							value={name}
							readOnly={readOnly}
							onChange={(e) => setName(e.target.value)}
							onBlur={() => {
								const copyList: ChatList[] = deepClone(list);
								copyList[index].name = name.trim() || item.name;
								setReadOnly.on();
								setList(copyList);
							}}
						/>
					)}

					<Popover placement="bottom">
						<PopoverTrigger>
							<Flex w="18px" justify="center">
								<Icon
									as={HiOutlineEllipsisVertical}
									color="gray.700"
									cursor="pointer"
									_hover={{ transform: "scale(1.1)" }}
									boxSize={5}
								/>
							</Flex>
						</PopoverTrigger>
						<PopoverContent w="110px" mt={1} ml={-2}>
							<PopoverArrow bg="bg.main" />
							<PopoverBody bg="bg.main" px={0} py={1}>
								<HStack
									w="full"
									_hover={{ bg: "gray.300" }}
									cursor="pointer"
									pl={4}
									py={1}
									onClick={() => {
										setName(item.name);
										setReadOnly.off();
										setTimeout(() => {
											myInput.current.focus();
										}, 100);
									}}
								>
									<Icon as={FiEdit} color="bg.green" boxSize={4} />
									<Text>Edit</Text>
								</HStack>
								<HStack
									w="full"
									_hover={{ bg: "gray.300" }}
									cursor="pointer"
									pl="15px"
									py={1}
									onClick={() => {
										onOpen();
										setOpt("delete");
									}}
								>
									<Icon as={RiDeleteBinLine} color="bg.green" boxSize={4} />
									<Text>Delete</Text>
								</HStack>
								<HStack
									w="full"
									_hover={{ bg: "gray.300" }}
									cursor="pointer"
									pl={4}
									py={1}
									onClick={() => {
										onOpen();
										setOpt("clear");
									}}
								>
									<Icon as={AiOutlineClear} color="bg.green" boxSize={4} />
									<Text>Clear</Text>
								</HStack>
							</PopoverBody>
						</PopoverContent>
					</Popover>
				</Flex>
			</PopoverTrigger>

			<PopoverContent w="220px" mt={1}>
				<PopoverArrow />
				<PopoverCloseButton
					size="sm"
					top="0px"
					right="0"
					pos="absolute"
					color="gray.400"
				/>
				<PopoverBody pt="7px">
					<Text>{`Are you sure to ${opt} this chat?`}</Text>
					<HStack w="full" justify="flex-end" mt={2}>
						<Button
							variant="outline"
							size="xs"
							borderRadius={3}
							onClick={() => {
								onClose();
							}}
						>
							Cancel
						</Button>
						<Button
							variant="bluePrimary"
							size="xs"
							onClick={() => {
								const copyList: ChatList[] = deepClone(list);
								if (opt === "delete") {
									copyList.splice(index, 1);
									setChatIndex(null);
								} else {
									copyList[index].children = [];
								}
								setList(copyList);
								onClose();
							}}
						>
							Confirm
						</Button>
					</HStack>
				</PopoverBody>
			</PopoverContent>
		</Popover>
	);
};

export function Tabs({
	list,
	chatIndex,
	isSandBox,
	sandBoxType,
	setChatIndex,
	setList,
	addChannel,
	setInput,
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
	setSandBoxType: (value: string) => void;
}) {
	const { showToast } = useStore();
	const { userId } = useUserInfoStore();

	const myTab = useRef<any>(null);

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

	const closeMenu = () => {
		const menu: any = document.querySelector(".ai-menu");
		menu.style.display = "none";
	};

	return (
		<VStack w="full" h="full" pos="relative">
			<Flex gap={2} w="full">
				<Text
					w="full"
					py={2}
					mb={2}
					fontSize="17px"
					fontWeight="semibold"
					pl="20px"
				>
					{isSandBox ? "Sandbox" : "General Chat"}
				</Text>
			</Flex>

			{/* <CloseButton className="menu-close" onClick={closeMenu} /> */}

			<VStack
				ref={myTab}
				w="full"
				flex={1}
				pt={1}
				spacing={1}
				overflowY="scroll"
				className="no-scrollbar"
			>
				{userId &&
					list.map((item: any, index: number) => {
						return (
							<TabItem
								key={index}
								index={index}
								item={item}
								list={list}
								chatIndex={chatIndex}
								setChatIndex={setChatIndex}
								setList={setList}
							/>
						);
					})}

				<Box pt={2}>
					<HStack
						justify="space-between"
						w="200px"
						h="40px"
						fontWeight="400"
						fontSize="13px"
						borderRadius={6}
						cursor="pointer"
						bg={list.length === 0 ? "blackAlpha.100" : "#fff"}
						_hover={{ bg: "blackAlpha.200" }}
						px={2}
					>
						<Flex gap={2} flex={1} onClick={addChatChannel}>
							<Icon as={IoIosAdd} boxSize={5} />
							<Text> Add Chat</Text>
						</Flex>

						{isSandBox && (
							<Menu>
								<MenuButton>
									<Badge
										fontSize="xs"
										colorScheme="green"
										transform="scale(0.8)"
									>
										{sandBoxType}
									</Badge>
								</MenuButton>
								<MenuList minW="140px" py={1} mt="5px" ml="-52px">
									<MenuItem onClick={() => setSandBoxType("token2049")}>
										<HStack>
											<Icon as={RiCopperCoinLine} h="full" w="16px" />
											<Text> Token2049</Text>
										</HStack>
									</MenuItem>
									{/* <MenuItem onClick={() => setSandBoxType("Regular")}>
										<HStack ml="1px">
											<Icon as={AddIcon} w="12px" />
											<Text pl={1}> Regular</Text>
										</HStack>
									</MenuItem> */}
								</MenuList>
							</Menu>
						)}
					</HStack>
				</Box>
			</VStack>
		</VStack>
	);
}
