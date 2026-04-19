require("dotenv").config();
console.log("KEY:", process.env.GROQ_API_KEY);
const { generateDescription } = require("./utils/ai");

async function test() {
    const result = await generateDescription("Beach House", "Goa");
    console.log(result);
}

test();
