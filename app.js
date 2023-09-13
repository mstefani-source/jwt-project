import 'dotenv/config'
import { conn } from './config/database.js'
import express, { json } from "express";
import User from "./model/user.js";
import alljwt from 'jsonwebtoken';
const {jwt} = alljwt 

import pkg from 'body-parser';
const { json: js, urlencoded } = pkg;

import crypt from "bcryptjs";
const { hash } = crypt


const app = express();
app.use(json());
app.use(js());
app.use(urlencoded({ extended: true }))




conn()
// Logic goes here

// importing user context


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
		const oldUser = await User.findOne({ email })

		if (oldUser) {
			return res.status(409).send("User Already Exist. Please Login");
		}

		// Encrypt user password
		const encryptedPassword = await hash(password, 10);

		// Create user in our database

		const user = await User.create({
			first_name,
			last_name,
			email: email.toLowerCase(),
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
app.post("/login", async (req, res) => {
	// our login logic goes here
	try {

		const { query, body, route, params, headers } = req;

		console.log("query: ", query)
		console.log("body: ", body)
		console.log("route: ", route.path)
		console.log("params: ", params)
		console.log("headers.content-type: ", headers["content-type"])

		const { email, password } = req.body;

		// Validate user input
		if (!(email && password)) {
			res.status(400).send("application: All inputs are required")
		} else {

			// user
			const user = await User.findOne({ email });
			if (user) {
				res.status(200).json(user)
			}
			res.status(400).send('application: Invalid Credentials')
		}
	} catch (e) {
		console.log(e)
	}
});

export default app;