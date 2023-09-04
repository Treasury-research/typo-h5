import {
	Box,
	VStack,
	Image,
	Icon,
	Center,
	Badge,
	Text,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { TiSocialTwitter } from "react-icons/ti";
import { FaTelegramPlane } from "react-icons/fa";
import { SiSubstack } from "react-icons/si";
import { BsChatDots, BsBox } from "react-icons/bs";
import { HiOutlineChatBubbleLeft } from "react-icons/hi2";

export function Left({
	leftIndex,
	isSandBox,
	setLeftIndex,
	setIsSandBox,
}: {
	leftIndex: number;
	isSandBox: boolean;
	setLeftIndex: (value: number) => void;
	setIsSandBox: {
		on: () => void;
		off: () => void;
		toggle: () => void;
	};
}) {
	const router = useRouter();

	return (
		<VStack w="70px" h="full" bg="#FFF8EB" py={4} justify="space-between">
			<VStack w="full">
				<Image
					mt={1}
					src="/images/no_bg_logo.svg"
					alt=""
					h="32px"
					onClick={() => router.push("https://typography.vip")}
					cursor="pointer"
				/>

				<VStack w="full" pt={10} spacing={10}>
					<VStack
						w="58px"
						pt={1}
						color={leftIndex === 0 ? "bg.green" : "#616161"}
						cursor="pointer"
						spacing="2px"
						onClick={() => {
							setIsSandBox.off();
							setLeftIndex(0);
						}}
					>
						<Center
							w="42px"
							h="33px"
							px={1}
							bg={leftIndex === 0 ? "#fff" : ""}
							borderRadius={5}
							cursor="pointer"
							_hover={{ bg: "blackAlpha.200" }}
							boxShadow={
								leftIndex === 0 ? "0px 0px 6px 0px rgba(0, 0, 0, 0.15)" : ""
							}
						>
							<Icon as={BsChatDots} boxSize={5} />
						</Center>
						<Text fontSize="xs">Chat</Text>
					</VStack>

					<VStack
						w="58px"
						pt={1}
						id="sandbox"
						color={leftIndex === 1 ? "bg.green" : "#616161"}
						cursor="pointer"
						spacing="2px"
						onClick={() => {
							setIsSandBox.on();
							setLeftIndex(1);
						}}
					>
						<Center
							w="40px"
							h="33px"
							px={1}
							bg={leftIndex === 1 ? "#fff" : ""}
							borderRadius={5}
							cursor="pointer"
							boxShadow={
								leftIndex === 1 ? "0px 0px 6px 0px rgba(0, 0, 0, 0.15)" : ""
							}
							_hover={{ bg: "blackAlpha.200" }}
						>
							<Icon as={BsBox} boxSize={5} />
						</Center>
						<Text fontSize="xs" whiteSpace="nowrap" transform="scale(0.7)">
							TOKEN2049
						</Text>
					</VStack>
				</VStack>
			</VStack>

			<VStack w="full" color="bg.green" spacing={7} pb={5}>
				<Icon
					as={TiSocialTwitter}
					className="cursor-pointer"
					onClick={() => window.open("https://twitter.com/Knn3Network")}
					boxSize={6}
					_hover={{ transform: "scale(1.15)" }}
				/>

				<Icon
					as={FaTelegramPlane}
					className="cursor-pointer"
					onClick={() => window.open("https://t.me/+zR-uaI0Bt_hjMjY9")}
					boxSize={5}
					_hover={{ transform: "scale(1.15)" }}
				/>

				<Icon
					as={SiSubstack}
					pt={1}
					className="cursor-pointer"
					onClick={() => window.open("https://knn3.substack.com/")}
					boxSize={5}
					_hover={{ transform: "scale(1.15)" }}
				/>
			</VStack>
		</VStack>
	);
}
