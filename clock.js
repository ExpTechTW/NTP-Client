let Timer = 60000;
// 自動校時週期 (ms)


const child_process = require("child_process");
const axios = require("axios");

let Lock = false;

const Data = {
	"APIkey"   : "https://github.com/ExpTechTW",
	"Function" : "NTP",
};

main();

setInterval(() => {
	main();
}, Timer);

async function main() {
	if (Lock) return;
	Lock = true;
	try {
		const _TO = Date.now();
		let res = await axios.post("http://exptech.com.tw/post", Data).catch((err) => { console.log(err.response.data); });
		if (res == undefined) return;
		const DATE = new Date(res.data.addition.Full + (Date.now() - _TO) / 2 + 1000);
		const _T = Date.now();
		while (true)
			if (Date.now() - _T >= 1000 - DATE.getMilliseconds()) {
				child_process.exec(`time ${DATE.getHours()}:${DATE.getMinutes()}:${DATE.getSeconds()}`);
				child_process.exec(`date ${DATE.getMonth() + 1}/${DATE.getDate()}/${DATE.getFullYear()}`);
				console.log("校時");
				Lock = false;
				break;
			}
	} catch (err) {
		console.log(err);
		Lock = false;
	}
}