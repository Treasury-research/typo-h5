import Chat from "components/chat";
import ChatProvider from "components/chat/Context";
import { NextSeo } from "components";
import { useEffect } from "react";
import { isPhone } from "lib";
import { useRouter } from "next/router";

export default function Home() {
	const router = useRouter();
	useEffect(() => {
		if (!isPhone() && !location.host.includes("localhost")) {
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
