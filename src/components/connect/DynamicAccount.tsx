import dynamic from "next/dynamic";

const ConnectAccount = dynamic(() => import("./Account"), {
	ssr: false,
});

export const DynamicAccount = ({ isSandBox }: { isSandBox: boolean }) => {
	return (
		<>
			<ConnectAccount isSandBox={isSandBox} />
		</>
	);
};
