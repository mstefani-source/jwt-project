import 'dotenv/config'
import { conn } from './config/database.js'
import express, { json } from "express";
import { findOne, create } from "./model/user.js";
//import {json as js, urlencoded } from "body-parser";
import pkg from 'body-parser';
const {json: js, urlencoded } = pkg;
const app = express();

conn()

app.use(json());

app.use(js());
app.use(urlencoded({extended: true}))

// Logic goes here

// importing user context

// import { hash } from "bcryptjs/dist/bcrypt.js";

// const bcrypt = require('bcryptjs');
// const salt = bcrypt.genSaltSync(10)
// const hash = bcrypt.hashSync(password, salt)

// Register
app.post("/register", async (req, res) => {
	// our register logic goes here...

	try {
		// Get user input
		const { first_name, last_name, email, password } = req.body;

		// Validate user input
		if (!(email && password && first_name && last_name)) {
			res.status(400).send("All input is reqired")
		}
		// check if user already exist
		// Validate if user exist in our database
		const oldUser = await findOne({ email })

		if (oldUser) {
			return res.status(409).send("User Already Exist. Please Login");
		}

		// Encrypt user password
		encryptedPassword = await hash(password, 10);

		// Create user in our database

		const user = await create({
			first_name,
			last_name,
			email: email.toLoweCase(),
			password: encryptedPassword,
		})

		// Create token
		const token = jwt.sign(
			{ user_id: user._id, email },
			process.env.TOKEN_KEY,
			{
				expiresIn: "2h",
			}
		);
		// save user token

		user.token = token;

		// return new user
		res.status(201).json(user);

		// Our register logic ends here	

	} catch (err) {
		console.log(err);
	}

});

// Login
app.post("/login", (req, res) => {
	// our login logic goes here
	try {
		console.log("query: ", req.query)
		console.log("body: ", req.body)
		console.log("route: ", req.route.path)
		console.log("params: ", req.params)
		console.log("headers: ", req.headers)
	
		//console.log("x-www: ", req.resume(hostname))

		const { email, password } = req.body;

		// Validate user input
		if (!(email && password)) {
			res.status(400).send("application: All inputs are required")
		} else {

			// user

			res.status(200).send("data OK")
		}
	}catch(e){
		console.log(e)
	}
});

export default app;