import { useToast } from "@chakra-ui/react";
import { useEffect, ReactNode } from "react";
import { useStore } from "store";
import { Notify } from "react-vant";

export function Toasts({
	message,
	type = "primary",
	time = 3000,
}: {
	message: string;
	type?: "success" | "danger" | "warning" | "primary" | undefined;
	time: number | undefined;
}) {
	const toast = useToast();
	const { showToast } = useStore();

	useEffect(() => {
		if (message) {
			Notify.show({ type: type, message: message, duration: time });
			showToast("");
		}
	}, [message, type, time, toast, showToast]);

	return <></>;
}
