import {
	Box,
	Text,
	HStack,
	VStack,
	Avatar,
	Flex,
	Icon,
	useToast,
} from "@chakra-ui/react";
import { useUserInfoStore } from "store/userInfoStore";
import BeatLoader from "react-spinners/BeatLoader";
import { ChatChildren, ChatList } from "lib/types";
import { Operate } from "../Operate";
import { AiFillCaretLeft, AiFillCaretRight } from "react-icons/ai";
import useChatContext from "hooks/useChatContext";
import { QuoteTem } from "../QuoteTem";
import MoreIcon from "components/icons/More/white";
import { useCallback } from "react";

export function Right({ item, index, chatIndex, isLoading }: any) {
	const { activeChat, isGenerate, setActionSheetProps, setIsActionSheetOpen } =
		useChatContext();

	const showToast = useToast();

	const openMessageActionSheet = useCallback(() => {
		if (isLoading || isGenerate) {
			showToast({
				position: "top",
				title: "Content is loading, please wait.",
				variant: "subtle",
			});
			return;
		}

		setActionSheetProps({
			item,
			index,
			chatIndex: chatIndex,
			type: "message",
		});
		setIsActionSheetOpen.on();
	}, [item, index]);

	return (
		<VStack w="full" spacing={3}>
			<HStack w="full" justify="flex-end" alignItems="flex-start">
				<Box
					className="ai-right-content-width relative"
					key={item.createTime}
					mr={1}
					px="12px"
					py="7px"
					maxW="calc(100% - 90px)"
					bg="bg.green"
					color="bg.white"
					borderRadius={5}
				>
					{!isLoading && (
						<Box
							position="absolute"
							left="-25px"
							top="9px"
							transform="rotate(90deg);"
							onClick={openMessageActionSheet}
						>
							<MoreIcon />
						</Box>
					)}

					{item.quoteContent && (
						<Box className="mt-2 mb-2 w-[fit-content]">
							<QuoteTem
								content={item.quoteContent}
								showDeleteIcon={false}
								type={item.quoteType}
							/>
						</Box>
					)}
					<Text whiteSpace="pre-wrap">{item.content as string}</Text>
					<Icon
						as={AiFillCaretRight}
						boxSize={4}
						pos="absolute"
						right="-11px"
						top="9px"
						color="bg.green"
					/>
				</Box>
				<Avatar size="sm" bg="bg.green" />
			</HStack>
			{index === activeChat.messages.length - 1 && isLoading && (
				<HStack w="full" justify="flex-start" spacing={3}>
					<Avatar size="sm" src="/images/aisql/TypoGraphy.svg" mr={1} />
					<Flex
						pos="relative"
						bg="bg.white"
						w="100px"
						h="35px"
						justify="center"
						alignContent="center"
						borderRadius={5}
						pt="12px"
					>
						<BeatLoader size={6} />
						<Icon
							as={AiFillCaretLeft}
							boxSize={4}
							pos="absolute"
							left="-11.4px"
							top="9px"
							color="gray.100"
						/>
					</Flex>
				</HStack>
			)}
		</VStack>
	);
}
