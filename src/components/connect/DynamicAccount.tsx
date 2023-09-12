import dynamic from "next/dynamic";

const ConnectAccount = dynamic(() => import("./Account"), {
	ssr: false,
});

export const DynamicAccount = ({
	isSandBox,
	closeNav,
}: {
	isSandBox: boolean;
	closeNav: () => void;
}) => {
	return (
		<>
			<ConnectAccount isSandBox={isSandBox} closeNav={closeNav}/>
		</>
	);
};
