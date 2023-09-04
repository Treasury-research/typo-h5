import { Router, useRouter } from "next/router";
import { useEffect } from "react";
import { driver } from "driver.js";

import "driver.js/dist/driver.css";
import { useBoolean } from "@chakra-ui/react";

export function Driver() {
	const router = useRouter();

	const showDriver = () => {
		const driverObj = driver({
			showProgress: true,
			allowClose: false,
			disableActiveInteraction: true,
			steps: [
				{
					element: "#sandbox",
					popover: {
						title: "Sandbox for TOKEN2049",
						description:
							"The Sandbox allows special conversational scenarios. Give it a try - ask about TOKEN2049 plans.",
						side: "left",
						align: "start",
					},
				},
				{
					element: "#commands",
					popover: {
						title: "Start with Shortcuts",
						description:
							"If you're not sure what to ask, get started with suggested shortcuts.",
						side: "bottom",
						align: "start",
					},
				},
			],

			onDestroyed: () => {
				localStorage.setItem("isFinishDriver", "true");
			},
		});

		driverObj.drive();
	};

	useEffect(() => {
		const isFinish = localStorage.getItem("isFinishDriver");
		!isFinish && showDriver();
	}, [router]);

	return <></>;
}
