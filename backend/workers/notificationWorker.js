// notificationWorker.js — processes jobs in the background.

const { Worker} = require("bullmq")

const notificationWorker = new Worker(
    "notification",  // Name of the queue to listen to
    async (job)=>{   // The job received by the worker

        if(job.name == "task-assigned"){
            console.log("Task Assinged notification")
        }

        if(job.name === "task-completed"){
            console.log("Task completed notification")
        }

        if(job.name === "employee-add"){
            console.log("employee added")
        }

        // if error occue
        if(job.name === "test-failed"){
            console.log("Testing failed cases")

            throw new Error("Something went wrong")
        }

        // Log only identifiers and event metadata; never dump user documents or credentials.
        console.log({ jobName: job.name, teamId: job.data.teamId, employeeId: job.data.employeeId })

        console.log("Worker received job:", job.id);
        console.log("Job processed successfully!");
    },
    {
        connection:{ // Redis conenction detaos 
            host: "localhost",
            port: 6379
        }
    }
)



// 1. createTask controller
// 2. notificationQueue.add()
// 3. Redis stores the job
// 4. notificationWorker receives the job
// 5. console.log(job.data)
