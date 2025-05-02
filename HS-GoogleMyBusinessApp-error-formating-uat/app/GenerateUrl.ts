const app = {
	stream: 'stream-posts',
	pid: '10700967',
	token:
		'5b70955501a3b36a861b3cbfce9a476ea3505a96faefed2589d8c60e21fa8e387fcd8db69242ab76918b41a68224af8b35b77f94828ddf2c9176b8b900e1e816',
	ts: '1631314020',
	uid: '19599466',
};

const url = `http://localhost:3000/app/${app.stream}?stream=${app.stream}&lang=en&timezone=-28800&isSsl=1&theme=classic&i=19810861&pid=${app.pid}&uid=${app.uid}&ts=${app.ts}&token=${app.token}`;

console.log(url);
