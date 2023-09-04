import { useToast } from "@chakra-ui/react";
import { useEffect, ReactNode } from "react";
import { useStore } from 'store';

export function Toasts({
	message,
	type,
	time,
	isClosable,
	position
}: {
	message: string;
	type: "success" | "error" | "warning" | "info" | undefined;
	time: number | undefined;
	isClosable: boolean;
	position: 'top' | 'top-right' | 'top-left' | 'bottom' | 'bottom-right' | 'bottom-left' | undefined,
}) {
	const toast = useToast();
	const { showToast } = useStore();

	useEffect(() => {
		if (message) {
			toast({
				description: message,
				duration: time || 3000,
				position: "top-right",
				variant: "subtle",
				status: type || "info",
				isClosable: isClosable || false,
			});
			showToast('')
		}
	}, [message, type, time, toast, isClosable, position, showToast]);

	return <></>;
}
