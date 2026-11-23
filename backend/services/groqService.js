const Groq = require("groq-sdk")
require("dotenv")

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
})

const generateTasks = async (projectName, projectDescription) => {

    const response = await groq.chat.completions.create({
        model: "openai/gpt-oss-120b",

        messages: [
            {
                role: "system",  // The system role tells the AI how it should behave and what rules it should follow.
                content: `You are an expert project manager.
                Generate 5 to 10 actionable tasks based on the project.
                Each task must have a title and description.
                Return the result as JSON in this format:
                {
                    "tasks": [
                        {
                            "title": "Task title",
                            "description": "Task description"
                        }
                    ]
                }
                Only generate relevant tasks.`
            },
            {
                role: "user",
                content: `Project Name: ${projectName}
                Project Description: ${projectDescription}`
            }
        ],

        response_format: {
            type: "json_object"
        },

        temperature: 0.5
    });

    const content = response.choices[0].message.content;

    const generatedTasks = JSON.parse(content);

    return generatedTasks.tasks;
};





module.exports = {generateTasks}