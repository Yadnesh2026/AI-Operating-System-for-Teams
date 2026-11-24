const Groq = require("groq-sdk")
require("dotenv")

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
})

// For Ai task generator 
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

const askProjectAssistant = async(projectContext, userQuestions)=>{

    const response = await groq.chat.completions.create({
        model:"openai/gpt-oss-120b",

    messages:[
       {
        role: "system",
        content: `You are RedSun AI, an intelligent project assistant.
        Answer questions based only on the project information provided.
        Give clear, simple and helpfull answers.
        If the information is not available say that you don't have enough information.
        Do not make up project details.`
       },{
        role:"user",
        content:`Project Information:
        ${projectContext}
        
        User Question:
        ${userQuestions}`
       }

    ],
    })
    
     const content = response.choices[0].message.content
     return content;

    // response → Complete response from Groq.
    // choices[0] → First generated answer.
    // message.content → Actual text written by AI.


}





module.exports = {generateTasks, askProjectAssistant}