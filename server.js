const express = require('express'),
	app = express(),
	bodyParser = require("body-parser");

app.use(express.static('./'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true})); 

app.post("/mockSubmission", function(req, res) {
	res.json(req.body);
});

const server = app.listen(1337, () => {
  let host = LOCAL_IP(),
  	port = server.address().port;
  
  console.log(`Example app listening at http://${host}:${port} or http://localhost:${port}`);
});

const LOCAL_IP = () => {
	let interfaces = require("os").networkInterfaces();

	for(let i in interfaces){
		for(let k in interfaces[i]){
			let address = interfaces[i][k];

			if(address.family === "IPv4" && !address.internal){
				return address.address;
			}
		}
	}
};