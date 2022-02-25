const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/lugar', {
	useNewUrlParser: true,
	useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
	console.log('Database connected');
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
	await Campground.deleteMany({});
	for (let i = 0; i < 300; i++) {
		const random1000 = Math.floor(Math.random() * 500);
		const price = Math.floor(Math.random() * 20) + 10;

		const camp = new Campground({
			author: '61e7374b17af5bae1351e0a2',
			location: `${cities[random1000].city}, ${cities[random1000].admin_name}`,
			title: `${sample(descriptors)} ${sample(places)}`,
			description:
				'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Unde pariatur adipisci facere alias aspernatur molestiae beatae autem neque, iste tempore impedit quas eius id aperiam porro tempora reprehenderit sunt fuga?',
			price,
			geometry: {
                type: "Point",
                coordinates: [cities[random1000].lng,
				 cities[random1000].lat]
            },
			images:  [
				{
				  url: 'https://res.cloudinary.com/dzeizezav/image/upload/v1642626210/YelpCamp/iy8maizjmkfttvpdo8ub.jpg',
				  filename: 'YelpCamp/iy8maizjmkfttvpdo8ub',
				},
				{
				  url: 'https://res.cloudinary.com/dzeizezav/image/upload/v1642626210/YelpCamp/glwtssnfw1jc78snqla0.jpg',
				  filename: 'YelpCamp/glwtssnfw1jc78snqla0',
				}
			  ]
			
		});
		await camp.save();
	}
};

seedDB().then(() => {
	mongoose.connection.close();
});
