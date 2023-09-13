import { Icon, Text, Flex, VStack, Center, Box, Badge } from "@chakra-ui/react";
import { BsCommand } from "react-icons/bs";

import { useEffect, useMemo, useState } from "react";
import { Cell, Swiper, Typography, Image } from "react-vant";
import api from "api";
import { useUserInfoStore } from "store/userInfoStore";

const slides = [
	{
		url: "/images/aisql/token2049.png",
		link: "https://app.typography.vip?tab=sandbox",
	},
	{
		url: "/images/aisql/guide4.png",
		link: "https://knexus.xyz/create?utm_source=typo+quest&utm_campaign=kn+mbti",
	},
	// {
	// 	url: "/images/aisql/guide1.png",
	// 	link: "",
	// },
	// {
	// 	url: "/images/aisql/guide2.png",
	// 	link: "",
	// },
	// {
	// 	url: "/images/aisql/guide3.png",
	// 	link: "",
	// },
];

const sandboxSlides = [
	{
		url: "/images/aisql/token2049.png",
		link: "",
	},
	{
		url: "/images/aisql/token1.png",
		link: "",
	},
	{
		url: "/images/aisql/token2.png",
		link: "",
	},
	{
		url: "/images/aisql/token3.png",
		link: "",
	},
];

export function Guide({
	onSend,
	setInput,
	isSandBox,
}: {
	isSandBox: boolean;
	onSend: (isReGenerate?: boolean) => void;
	setInput: (value: string) => void;
}) {
	const [commands, setCommands] = useState([]);
	const { userId } = useUserInfoStore();

	const list = useMemo(() => {
		return isSandBox ? sandboxSlides : slides;
	}, [isSandBox]);

	const cmds = useMemo(() => {
		return isSandBox
			? commands.filter((item: any) => item?.type === "short")
			: commands.filter((item: any) => item?.type === "normal");
	}, [isSandBox, commands]);

	const getCommands = async () => {
		const result: any = await api.get("api/shortcut/questions");
		if (result?.code === 200) {
			setCommands(result?.data as any);
		}
	};

	useEffect(() => {
		if (userId) {
			getCommands();
		}
	}, [userId]);

	return (
		<VStack
			className="guide"
			w="full"
			h="full"
			justify="flex-start"
			alignItems="center"
		>
			<Swiper
				autoplay={5000}
				indicator={(total: number, current: any) => (
					<Box className="custom-indicator">
						{current + 1}/{total}
					</Box>
				)}
			>
				{list.map((item) => {
					return (
						<Swiper.Item key={item.url}>
							<Box
								cursor="pointer"
								onClick={() => item.link && window.open(item.link)}
							>
								<Image alt="" src={item.url} fit="contain" />
							</Box>
						</Swiper.Item>
					);
				})}
			</Swiper>

			<VStack w="full" justify="center" flexDir="column" spacing={5} mt="45px!">
				{cmds.map((item: any, index) => {
					return (
						<Box key={index} w="full" pos="relative">
							{isSandBox && (
								<Badge
									pos="absolute"
									right="6px"
									top="-9px"
									colorScheme="green"
									fontSize="xs"
									transform="scale(0.76)"
									zIndex={5}
								>
									token2049
								</Badge>
							)}
							<Cell.Group card>
								<Cell
									style={{ alignItems: "center" }}
									title={
										<Typography.Text ellipsis>{item?.question}</Typography.Text>
									}
									icon={<Icon as={BsCommand} w="20px" />}
									isLink
									onClick={() => {
										setInput(item?.question);
										onSend();
									}}
								/>
							</Cell.Group>
						</Box>
					);
				})}
			</VStack>
		</VStack>
	);
}
