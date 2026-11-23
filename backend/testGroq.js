require("dotenv").config();

const { generateTasks } = require("./services/groqService");

const testAI = async () => {
    try {
        const tasks = await generateTasks(
            "E-commerce Website",
            "Build an e-commerce platform with authentication, product listings, shopping cart and payment integration."
        );

        console.log("Generated Tasks:", tasks);

    } catch (error) {
        console.log("AI Error:", error.message);
    }
};

testAI();