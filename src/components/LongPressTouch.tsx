import { Box, Image, Tooltip, Link, useBoolean } from "@chakra-ui/react";
import { useEffect, useRef } from "react";

interface LongPressButtonProps {
	onLongPress?: () => void;
	isOpen: boolean;
	children: React.ReactNode;
	PressArea?: React.ReactNode;
	onOpen?: () => void;
}

export function LongPressTouch({
	children,
	PressArea,
	isOpen,
	onLongPress,
	onOpen,
}: LongPressButtonProps) {
	const myArea = useRef<any>(null);

	useEffect(() => {
		let timer: number;

		const handleTouchStart = () => {
			// onOpen && onOpen();
			timer = window.setTimeout(() => {
				// onOpen && onOpen();
				onLongPress && onLongPress();
			}, 1000);
		};

		const handleTouchEnd = () => {
			window.clearTimeout(timer);
		};

		myArea.current?.addEventListener("touchstart", handleTouchStart);
		myArea.current?.addEventListener("touchend", handleTouchEnd);

		return () => {
			myArea.current?.removeEventListener("touchstart", handleTouchStart);
			myArea.current?.removeEventListener("touchend", handleTouchEnd);
		};
	}, [onLongPress]);

	return (
		<>
			<Box w="full" h="auto" ref={myArea} background="transparent">
				{children}
			</Box>
			{isOpen && <>{PressArea}</>}
		</>
	);
}
