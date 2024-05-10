import Chat from "components/chat";
import ChatProvider from "components/chat/Context";
import { NextSeo } from "components";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { isMobile } from "react-device-detect";

export default function Home() {
	const router = useRouter();
	useEffect(() => {
		if (!isMobile && !location.host.includes("localhost")) {
			location.host.includes("staging")
				? router.push("https://typography.staging.knn3.xyz")
				: router.push("https://app.typography.vip/");
		}
	}, [router]);
	return (
		<>
			<NextSeo title={"TypoX AI"} />
			<ChatProvider>
				<Chat />
			</ChatProvider>
		</>
	);
}
