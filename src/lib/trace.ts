export function PageViewTrace(path: string) {
	console.log(`View ${path}`);
	window.gtag("event", `View ${upperFirst(path)}`, {
		event_category: "general",
		event_label: path,
		value: new Date().toLocaleTimeString(),
	});
}

export function PageScrollTrace(path: string) {
	console.log(`Scroll ${path}`);
	window.gtag("event", `Scroll ${upperFirst(path)}`, {
		event_category: "general",
		event_label: path,
		value: new Date().toLocaleTimeString(),
	});
}

export function ButtonClickTrace(name: string) {
	console.log(`Click ${name}`);
	window.gtag("event", `Click ${upperFirst(name)}`, {
		event_category: "general",
		event_label: name,
		value: new Date().toLocaleTimeString(),
	});
}

function upperFirst(str: string) {
	str = str.toLowerCase();
	return str.replace(/\b\w|\s\w/g, (fw) => {
		return fw.toUpperCase();
	});
}
