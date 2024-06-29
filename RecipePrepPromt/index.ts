//AIzaSyADKj4cYMV55kM0iI_YHWrr3Lf0bHrkDoA

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.use(express.json());

interface Pantry {
  herbs_spices: string[];
  protein: string[];
  carbs: string[];
  fat: string[];
  fiber: string[];
  fruits: string[];
  vegetables: string[];
  beverages: string[];
  condiments: string[];
  snacks: string[];
}

// Mapping function to convert incoming data to Pantry format
function convertToPantry(data: { name: string; items: string[] }[]) {
  const pantry: Pantry = {
    herbs_spices: [],
    protein: [],
    carbs: [],
    fat: [],
    fiber: [],
    fruits: [],
    vegetables: [],
    beverages: [],
    condiments: [],
    snacks: [],
  };

  data.forEach((category: { name: string; items: string[] }) => {
    switch (category.name) {
      case "herbs/spices":
        pantry.herbs_spices = category.items;
        break;
      case "protein":
        pantry.protein = category.items;
        break;
      case "carbs":
        pantry.carbs = category.items;
        break;
      case "fat":
        pantry.fat = category.items;
        break;
      case "fiber":
        pantry.fiber = category.items;
        break;
      case "fruit":
        pantry.fruits = category.items;
        break;
      case "vegetable":
        pantry.vegetables = category.items;
        break;
      case "beverages":
        pantry.beverages = category.items;
        break;
      case "condiments":
        pantry.condiments = category.items;
        break;
      case "snacks":
        pantry.snacks = category.items;
        break;
      default:
        break;
    }
  });

  return pantry;
}

app.post("/ingredients", async (req, res) => {
  const pantry = convertToPantry(req.body);
  const herbs_spices = pantry.herbs_spices;
  const protein = pantry.protein;
  const fruits = pantry.fruits;
  const fiber = pantry.fiber;
  const carbs = pantry.carbs;
  const vegetables = pantry.vegetables;
  const fat = pantry.fat;
  const condiments = pantry.condiments;
  const beverages = pantry.beverages;
  const snacks = pantry.snacks;

  const text = await run(
    protein,
    herbs_spices,
    fruits,
    fiber,
    carbs,
    vegetables,
    fat,
    condiments,
    beverages,
    snacks
  );

  res.json({ message: "Data received successfully", recipe: text });
});

const genAI = new GoogleGenerativeAI("AIzaSyADKj4cYMV55kM0iI_YHWrr3Lf0bHrkDoA");

async function run(
  protein: string[],
  herbs_spices: string[],
  fruits: string[],
  fiber: string[],
  carbs: string[],
  vegetables: string[],
  fat: string[],
  condiments: string[],
  beverages: string[],
  snacks: string[]
) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `Ingredients:
                  Protein: [${protein[0]}, ${protein[1]}, ${protein[2]}]
                  Carbs: [${carbs[0]}, ${carbs[1]}, ${carbs[2]}, ${carbs[3]},${carbs[4]}]
                  Herbs/spices: [${herbs_spices[0]}, ${herbs_spices[1]},${herbs_spices[2]}, ${herbs_spices[3]},${herbs_spices[4]}, ${herbs_spices[5]}]
                  Vegetables: [${vegetables[0]}, ${vegetables[1]}, ${vegetables[2]},${vegetables[3]}, ${vegetables[4]}]
                  Fruits: [${fruits[0]}, ${fruits[1]}]
                  Fats: [${fat[0]}, ${fat[1]},${fat[3]}]
                  Fiber: [${fiber[0]}, ${fiber[1]},${fiber[2]}, ${fiber[3]}]
                  Condiments: [${condiments[0]}, ${condiments[1]}]
                  Beverages: [${beverages[0]}, ${beverages[1]}]
                  Snacks: [${snacks[0]}, ${snacks[1]}]
                  Using only the ingredients listed in my pantry ,
                  I want to prepare 3 meals (breakfast, lunch, and dinner) for one person for a day.
                  I need to be able to cook everything at once.
                  It's okay if lunch and dinner are the same with a slight twist to reduce cooking time.
                  also suggest me with some snacks`;
  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  return text;
}
app.listen(4000, () => {
  console.log("Hi There");
  console.log("Listening to port 4000");
});
