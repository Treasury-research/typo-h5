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
	Box,
} from "@chakra-ui/react";
import { useState, useCallback, useMemo } from "react";
import { useCopyToClipboard } from "react-use";
import html2Canvas from "html2canvas";
import { LongPressTouch } from "components";
import TwitterIcon from "components/icons/Twitter";
import LinkIcon from "components/icons/Link";
import { Popup, Dialog, Picker } from "react-vant";
import useChatContext from "hooks/useChatContext";
import { useQuoteStore } from "store/quoteStore";
import { useUserInfoStore } from "store/userInfoStore";
import api from "api";
import { useConnectModalStore } from "store/modalStore";

export function MessageActionSheet({ item, chatIndex, onClose }: any) {
	const { activeChat, removeMessage, isGenerate } = useChatContext();
	const { userId } = useUserInfoStore();
	const { setIsShowInputQuote, setQuoteContent, setQuoteType } =
		useQuoteStore();
	const { setOpenRemindModal, setOpenConnectModal } = useConnectModalStore();
	const { onCopy } = useClipboard(item.content as string);
	const [showDelete, setShowDelete] = useState(false);
	const showToast = useToast();

	const quoteMessage = useCallback(() => {
		if (isGenerate) {
			return;
		}
		if (!userId) {
			setOpenConnectModal(true);
			return;
		}
		if (activeChat && activeChat.isShare) {
			showToast({
				position: "top",
				title: "Please start your thread",
				variant: "subtle",
				status: "info",
			});
			return;
		}

		setIsShowInputQuote(true);
		setQuoteContent(item.content as string);
		setQuoteType("Chat");

		onClose();
	}, [item]);

	const copyMessage = useCallback(() => {
		onCopy();
		showToast({
			position: "top",
			title: "Copied",
			variant: "subtle",
		});
		onClose();
	}, [item]);

	const deleteMessage = useCallback(() => {
		removeMessage(activeChat.id, item.id);
		onClose();
	}, [item, activeChat]);

	const startDelete = useCallback(() => {
		setShowDelete(true);
	}, []);

	const endDelete = useCallback(() => {
		setShowDelete(false);
	}, []);

	// console.log(chatIndex, activeChat?.messages);

	const isLastLeftChat = useMemo(() => {
		if (!activeChat) return false;
		const isLast = chatIndex === activeChat?.messages.length - 1;
		const isAnswer = activeChat?.messages[chatIndex].type === "answer";
		return isLast && isAnswer;
	}, [activeChat, chatIndex]);

	if (showDelete) {
		return (
			<Box padding="24px">
				<Box fontSize="16px" fontWeight="700">
					Notice
				</Box>
				<Box fontSize="16px" fontWeight="500">
					Are you sure you want to delete this content? This operation is
					irreversible
				</Box>
				<Box
					width="100%"
					height="48px"
					display="flex"
					alignItems="center"
					justifyContent="center"
					fontSize="14ox"
					fontWeight="700"
					cursor="pointer"
					onClick={deleteMessage}
					borderRadius="6px"
					background="#357E7F"
					color="white"
					marginTop="10px"
				>
					Confirm
				</Box>
				<Box
					width="100%"
					height="48px"
					display="flex"
					alignItems="center"
					justifyContent="center"
					fontSize="14ox"
					fontWeight="700"
					cursor="pointer"
					onClick={endDelete}
					borderRadius="6px"
					background="white"
					color="#357E7F"
					border="1px solid #357E7F"
					marginTop="10px"
				>
					Cancel
				</Box>
			</Box>
		);
	}

	return (
		<>
			{isLastLeftChat && (
				<Box
					width="100%"
					height="60px"
					display="flex"
					alignItems="center"
					justifyContent="center"
					fontSize="16ox"
					fontWeight="500"
					cursor="pointer"
					onClick={quoteMessage}
				>
					Quote
				</Box>
			)}

			<Box
				width="100%"
				height="60px"
				display="flex"
				alignItems="center"
				justifyContent="center"
				fontSize="16ox"
				fontWeight="500"
				borderTop="1px solid #D8D8D8"
				cursor="pointer"
				onClick={copyMessage}
			>
				Copy
			</Box>
			<Box
				width="100%"
				height="60px"
				display="flex"
				alignItems="center"
				justifyContent="center"
				fontSize="16ox"
				fontWeight="500"
				borderTop="1px solid #D8D8D8"
				cursor="pointer"
				onClick={startDelete}
			>
				Delete
			</Box>
			<Box
				width="100%"
				height="60px"
				display="flex"
				alignItems="center"
				justifyContent="center"
				borderTop="2px solid #D8D8D8"
				fontSize="16ox"
				fontWeight="500"
				cursor="pointer"
				onClick={onClose}
			>
				Cancel
			</Box>
		</>
	);
}

export function ShareActionSheet({ item, index, onClose }: any) {
	const { activeChat, onScroll, isGenerate } = useChatContext();
	const [state, copyToClipboard] = useCopyToClipboard();
	const [showCopy, setShowCopy] = useState(false);
	const [createLoading, setCreateLoading] = useBoolean(false);
	const [shareName, setShareName] = useState("");
	const { userId } = useUserInfoStore();
	const showToast = useToast();

	console.log("activeChat", activeChat);
	
	const handleCreateShareChat: any = useCallback(() => {
		return new Promise(async (resolve, reject) => {
			try {
				setCreateLoading.on();
				const { data } = await api.post(`/api/conversation/shared/create_h5`, {
					conversation_id: activeChat.id,
					conversation: JSON.stringify({
						...activeChat,
						isShare: true,
					}),
				});
				setCreateLoading.off();
				if (data) {
					resolve({
						value: `${window.location.origin}/explorer/${data}`,
					});
				}
			} catch (error) {
				showToast({
					position: "top",
					title: "Failed to generate link",
					variant: "subtle",
					status: "error",
				});
				setCreateLoading.off();
				reject();
			}
		});
	}, [activeChat, showToast]);

	const shareTwitter = async () => {
		handleCreateShareChat()
			.then((res: any) => {
				if (res.value) {
					const question = activeChat.messages[activeChat.messages.length - 2]
						.content as string;
					const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
						`Q: ${
							question.length > 40
								? question.substring(0, 40) + "..."
								: question
						}

🤖️ Discover insights with @TypoX_AI!
        Share your answer and see what others think! 
🚀 Join the drop season event today! 
👇 Dive in & ask followup
#TypoX #Web3 #Airdrop #AI2Earn

`
					)}&url=${encodeURIComponent(`${res.value}`)}`;

					window.open(shareUrl, "_blank");
				}
			})
			.catch((error: any) => {
				console.log(error);
			});
	};

	const copyLink = useCallback(() => {
		handleCreateShareChat()
			.then((res: any) => {
				if (res.value) {
					copyToClipboard(res.value);
					showToast({
						position: "top",
						title: "Copied",
						variant: "subtle",
					});
					onClose();
				}
			})
			.catch((error: any) => {
				console.log(error);
			});
	}, [item]);

	const startCopy = useCallback(() => {
		onScroll(1000);
		setShowCopy(true);
	}, []);

	const endCopy = useCallback(() => {
		setShowCopy(false);
	}, []);

	if (showCopy) {
		return (
			<Box padding="24px">
				<Box fontSize="16px" fontWeight="700">
					Notice
				</Box>
				<Box fontSize="16px" fontWeight="500">
					Anyone who has access to a shared link can view and share the linked
					conversation. We encourage you not to share any sensitive content such
					as your wallet address, as anyone with the link can access the
					conversation or share the link with other people.
				</Box>
				<Box
					width="100%"
					height="48px"
					display="flex"
					alignItems="center"
					justifyContent="center"
					fontSize="14ox"
					fontWeight="700"
					cursor="pointer"
					onClick={() => {
						shareName === "link" ? copyLink() : shareTwitter();
					}}
					borderRadius="6px"
					background="#357E7F"
					color="white"
					marginTop="10px"
				>
					{createLoading ? "Waiting..." : "OK"}
				</Box>
				<Box
					width="100%"
					height="48px"
					display="flex"
					alignItems="center"
					justifyContent="center"
					fontSize="14ox"
					fontWeight="700"
					cursor="pointer"
					onClick={endCopy}
					borderRadius="6px"
					background="white"
					color="#357E7F"
					border="1px solid #357E7F"
					marginTop="10px"
				>
					Cancel
				</Box>
			</Box>
		);
	}

	return (
		<>
			<Box
				width="100%"
				fontWeight="500"
				fontSize="16px"
				display="flex"
				alignItems="center"
				justifyContent="center"
				marginBottom="10px"
			>
				<Box>Share To</Box>
			</Box>
			<Box
				width="100%"
				display="flex"
				alignItems="center"
				justifyContent="space-around"
				marginBottom="20px"
				marginTop="20px"
			>
				<Box
					display="flex"
					alignItems="center"
					justifyContent="center"
					flexDirection="column"
					onClick={() => {
						setShareName("twitter");
						startCopy();
					}}
				>
					<Box marginBottom="10px">
						<TwitterIcon />
					</Box>
					<Box fontWeight="500" fontSize="16px">
						Twitter
					</Box>
				</Box>
				<Box
					display="flex"
					alignItems="center"
					justifyContent="center"
					flexDirection="column"
					onClick={() => {
						setShareName("link");
						startCopy();
					}}
				>
					<Box marginBottom="10px">
						<LinkIcon />
					</Box>
					<Box fontWeight="500" fontSize="16px">
						Copy Link
					</Box>
				</Box>
			</Box>
		</>
	);
}

export function SourceActionSheet({ source, index, onClose, onPreview }: any) {
	const { userId } = useUserInfoStore();
	const showToast = useToast();
	const { setOpenRemindModal, setOpenConnectModal } = useConnectModalStore();
	if (!userId) {
		setOpenConnectModal(true);
		onClose();
		return;
	}

	const previewSource = () => {
		if (onPreview) {
			onPreview();
		}

		onClose();
	};

	const openSource = () => {
		window.open(source.link);
		onClose();
	};

	return (
		<>
			<Box
				width="100%"
				height="60px"
				display="flex"
				alignItems="center"
				justifyContent="center"
				fontSize="16ox"
				fontWeight="500"
				onClick={previewSource}
			>
				Preview
			</Box>
			<Box
				width="100%"
				height="60px"
				display="flex"
				alignItems="center"
				justifyContent="center"
				fontSize="16ox"
				fontWeight="500"
				borderTop="1px solid #D8D8D8"
				onClick={openSource}
			>
				Original Link
			</Box>
			<Box
				width="100%"
				height="60px"
				display="flex"
				alignItems="center"
				justifyContent="center"
				borderTop="2px solid #D8D8D8"
				fontSize="16ox"
				fontWeight="500"
				onClick={onClose}
			>
				Cancel
			</Box>
		</>
	);
}

export function Operate({ children }: any) {
	const {
		setInput,
		submitMessage,
		activeChat,
		activeChatId,
		removeMessage,
		isGenerate,
		isActionSheetOpen,
		setIsActionSheetOpen,
		actionSheetProps,
	} = useChatContext();
	const { type } = actionSheetProps;
	// const showToast = useToast();
	// const [isOpen, setIsOpen] = useBoolean(false);
	/*
	 *   console.log('item', item)
	 *   const { onCopy } = useClipboard(item.content as string);
	 *
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
					style={{ width: "calc(100%)" }}
					visible={isActionSheetOpen}
					onClose={setIsActionSheetOpen.off}
				>
					<Box>
						<Box
							height="30px"
							width="100%"
							display="flex"
							alignItems="center"
							justifyContent="center"
							marginBottom="10px"
						>
							<Box height="4px" width="40px" background="#CCCCCC" />
						</Box>
						{type === "message" && (
							<MessageActionSheet
								{...actionSheetProps}
								onClose={setIsActionSheetOpen.off}
							/>
						)}
						{type === "share" && (
							<ShareActionSheet
								{...actionSheetProps}
								onClose={setIsActionSheetOpen.off}
							/>
						)}
						{type === "source" && (
							<SourceActionSheet
								{...actionSheetProps}
								onClose={setIsActionSheetOpen.off}
							/>
						)}
					</Box>
				</Popup>
			}
		>
			<Flex w="full" pos="relative" gap={2} background="transparent">
				{children}
			</Flex>
		</LongPressTouch>
	);
}
