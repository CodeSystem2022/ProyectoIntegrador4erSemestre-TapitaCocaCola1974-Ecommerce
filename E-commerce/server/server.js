const express = require("express");
const app = express();
const { pool, insertarCarritoEnBD } = require('./connection.js');
const cors = require("cors");
const mercadopago = require("mercadopago");
const path = require("path");
app.use(express.json());



//ruta de ticket
app.post('/create_preferences', (req, res) => {
	const jsonData = req.body; // Access the JSON data from the request body
	console.log('Received JSON data:', jsonData);
  
	// Your processing logic here
  
	res.status(200).json({ message: 'JSON data received successfully',data: jsonData });
  });
  

// REPLACE WITH YOUR ACCESS TOKEN AVAILABLE IN: https://developers.mercadopago.com/panel
mercadopago.configure({
	access_token: "TEST-5420367737113454-091721-f65cb7f000ef953a612eab79412fcd42-56024832",
});
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static(path.join(__dirname, "../client")));
app.use(cors());

app.get("/", function () {
	path.resolve(__dirname, "..", "client", "index.html");
});

app.post("/create_preference", (req, res) => {

	let preference = {
		items: [
			{
				title: req.body.description,
				unit_price: Number(req.body.price),
				quantity: Number(req.body.quantity),
			}
		],
		back_urls: {
			"success": "http://localhost:8081",
			"failure": "http://localhost:8081",
			"pending": ""
		},
		auto_return: "approved",
	};

	mercadopago.preferences.create(preference)
		.then(function (response) {
			res.json({
				id: response.body.id
			});
		}).catch(function (error) {
			console.log(error);
		});
});

app.get('/feedback', function (req, res) {
	res.json({
		Payment: req.query.payment_id,
		Status: req.query.status,
		MerchantOrder: req.query.merchant_order_id
	});
});

app.listen(8081, () => {
	console.log("The server is now running on Port 8081");
});


