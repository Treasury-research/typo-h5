import {
	Box,
	Flex,
	Text,
	Button,
	Tooltip,
	HStack,
	VStack,
	Avatar,
	Icon,
	useBoolean,
} from "@chakra-ui/react";
import api from "api";
import { BaseModal } from "components";
import { ButtonClickTrace, deepClone } from "lib";
import { ChatChildren, ChatList } from "lib/types";
import { BsArrowRightShort, BsTelegram, BsTwitter } from "react-icons/bs";
import { useStore } from "store";
import { useAiStore } from "store/aiStore";
import { FaTelegramPlane } from "react-icons/fa";
import { useUserInfoStore } from "store/userInfoStore";
import { useMemo } from "react";
import { NoticeBar } from "react-vant";

export function ChatSubmit({
	item,
	index,
	chatIndex,
	list,
	children,
	setInput,
	setList,
}: {
	item: ChatChildren;
	index: number;
	chatIndex: number;
	list: ChatList[];
	children?: React.ReactElement | React.ReactElement[];
	setInput?: (value: string) => void;
	setList: (value: ChatList[]) => void;
}) {
	const { showToast } = useStore();
	const [showModal, setShowModal] = useBoolean(false);
	const [isLoading, setIsLoading] = useBoolean(false);
	const { setUsedCoupon, usedCoupon } = useAiStore();
	const { userId } = useUserInfoStore();

	const isSandBox = useMemo(() => {
		return list[chatIndex]?.isSandBox;
	}, [list, chatIndex]);

	const handleSubmit = async () => {
		setIsLoading.on();
		const copyList: ChatList[] = deepClone(list);

		try {
			const result: any = await api.post(`/api/conversation/rate  `, {
				id: item?.id,
			});
			if (result?.code === 200) {
				copyList[chatIndex].children[index].submit = "Submited";
				if (item?.type === "nl") {
					copyList[chatIndex].children[index + 1].submit = "Submited";
				} else {
					if (copyList[chatIndex].children[index - 1]?.id === item.id) {
						copyList[chatIndex].children[index - 1].submit = "Submited";
					}
				}

				setList(copyList);
				showToast("Submit success!", "success");
				setUsedCoupon(usedCoupon + 5);
			} else {
				showToast(result.data?.errorMsg || "Submit error!", "danger");
			}
			setIsLoading.off();
			ButtonClickTrace("Submit_confirm");
		  setShowModal.off();
		} catch (error) {
			setIsLoading.off();
			ButtonClickTrace("Submit_confirm");
			setShowModal.off();
			showToast("Submit error!", "danger");
		}
	};

	return (
		<>
			<Tooltip
				placement="top"
				fontSize="xs"
				bg="#e6b65a"
				color="#fff"
				opacity={0.9}
				fontWeight="semibold"
				label={
					item.id
						? item.submit
							? "Submited"
							: "Submit this Q&A to the Gallery"
						: "The Q&A cannot be submitted, try a new question"
				}
				hasArrow
			>
				<Flex pos="absolute" mt="0!" right="-24px" top="-12px" justify="center">
					{item.tool !== "uniswap" && (
						<Button
							variant="yellowPrimary"
							size="xs"
							transform="scale(0.71)"
							borderRadius={5}
							fontWeight="semibold"
							onClick={() => {
								ButtonClickTrace("Submit");
								setShowModal.on();
							}}
							_hover={{ transform: "scale(0.75)" }}
							isDisabled={item.id ? (item.submit ? true : false) : true}
						>
							<Text>
								{item.id ? (item.submit ? "Submited" : "Submit") : "Submit"}
							</Text>
							{item.id && !item.submit && (
								<Icon as={BsArrowRightShort} boxSize={5} ml={0} mr={-1} />
							)}
						</Button>
					)}
				</Flex>
			</Tooltip>

			<BaseModal
				isOpen={showModal}
				onClose={setShowModal.off}
				title={item.submit && isSandBox ? "Share" : "Submit"}
				size="lg"
			>
				<VStack color="text.black" spacing={3} lineHeight="20px">
					{isSandBox ? (
						<>
							{item.submit ? (
								<Text ml={1} w="full">
									Share for a chance to win 2,049 TCC and get referral rewards!
								</Text>
							) : (
								<>
									<Text ml={1} w="full">
										Spend 5 TCC to submit your Q&A to the TOKEN2049 Quest
									</Text>
									<NoticeBar
										style={{ width: "100%" }}
										wrapable={false}
										scrollable
										speed={30}
										text="*Only qualified questions related to TOKEN2049 will be rewarded."
									/>
								</>
							)}
						</>
					) : (
						<>
							<Text ml={1} w="full">
								Spend 5 TCC to submit this Q&A to the Questionnaire Contest.
							</Text>
							<NoticeBar
								style={{ width: "100%" }}
								wrapable={false}
								scrollable
								speed={30}
								text="*Only questions related to Tusima zkBridge will be rewarded."
							/>
						</>
					)}
				</VStack>
				<Flex justify="space-between" alignItems="flex-end">
					<Button
						variant="whitePrimary"
						size="xs"
						mr={4}
						color="#fff"
						bg="#229ED9"
						border="0"
						_hover={{ bg: "#229ED9", opacity: 0.7 }}
						leftIcon={<Icon as={FaTelegramPlane} boxSize={4} pr={1} />}
						onClick={() => {
							window.open("https://t.me/+zR-uaI0Bt_hjMjY9");
						}}
					>
						Join our community
					</Button>

					{item.submit ? (
						<Button
							mt={5}
							variant="bluePrimary"
							size="xs"
							onClick={() => {
								const url = encodeURIComponent(
									`https://app.typography.vip?tab=sandbox&inviteId=${userId}`
								);
								const shareUrl = `https://twitter.com/share?text=${encodeURIComponent(
									`Let TypoGraphy AI discover the perfect events from over 210+ #TOKEN2049 options for you!
#TOKEN2049 #TypoGraphy_AI
Try it out:
`
								)}&url=${url}`;

								ButtonClickTrace("Share");
								window.open(shareUrl);
							}}
							leftIcon={<Icon as={BsTwitter} />}
						>
							Share with Twitter
						</Button>
					) : (
						<Button
							mt={5}
							variant="bluePrimary"
							size="xs"
							onClick={handleSubmit}
							isLoading={isLoading}
							isDisabled={isLoading}
							loadingText="Submitting"
						>
							Submit
						</Button>
					)}
				</Flex>
			</BaseModal>
		</>
	);
}
