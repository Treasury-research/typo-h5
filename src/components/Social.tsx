import { Box, Image, Tooltip, Link } from "@chakra-ui/react";
import { ButtonClickTrace } from "lib/trace";

export function Social() {
	return (
		<div className="fixed bottom-[100px] right-6 md:flex mobile:hidden flex-col z-40 gap-4">
			<Image
				className="cursor-pointer w-[32px]"
				onClick={() => window.open("https://twitter.com/Knn3Network")}
				src="./images/socal2.png"
				alt=""
			/>
			<Image
				className="cursor-pointer w-[32px]"
				onClick={() => window.open("https://t.me/+zR-uaI0Bt_hjMjY9")}
				src="./images/socal3.png"
				alt=""
			/>
			<Image
				className="cursor-pointer w-[32px]"
				onClick={() => window.open("https://knn3.substack.com/")}
				src="./images/socal1.png"
				alt=""
			/>
		</div>
	);
}
