const mongoose = require('mongoose');
const Interpretation = require('./models/Interpretation');
const connectDB = require('./config/db');
require('dotenv').config();

const interpretations = [
  {
    keyword: "flying",
    meaning: "Flying in dreams often represents a desire for freedom or escape from life's constraints. It can also symbolize ambition or rising above problems.",
    cultural_origin: "Western"
  },
  {
    keyword: "falling",
    meaning: "Falling dreams typically represent feelings of insecurity, lack of control, or fear of failure in waking life.",
    cultural_origin: "Universal"
  },
  {
    keyword: "teeth",
    meaning: "Dreams about losing teeth may indicate anxiety about appearance, fear of getting older, or concerns about communication.",
    cultural_origin: "Western"
  },
  {
    keyword: "water",
    meaning: "Water often represents emotions. Calm water suggests peace while turbulent water may indicate emotional turmoil.",
    cultural_origin: "Eastern"
  },
  {
    keyword: "snake",
    meaning: "Snakes can symbolize transformation, healing, or hidden threats depending on the context of the dream.",
    cultural_origin: "Indigenous"
  }
];

const seedDB = async () => {
  await connectDB();
  
  await Interpretation.deleteMany({});
  await Interpretation.insertMany(interpretations);
  
  console.log('Database seeded!');
  process.exit();
};

seedDB();