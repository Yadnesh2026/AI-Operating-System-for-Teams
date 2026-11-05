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
            console.log("Employee added")
        }

         console.log(job.data)  // Data passed when adding the job

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