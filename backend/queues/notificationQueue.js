// notificationQueue.js — creates the queue and adds jobs.

// 1. What is a Queue in BullMQ?
// A queue is where we add jobs that need to be processed later.

const { Queue } = require("bullmq")  //  BullMQ class used to create a queue

const notificationQueue = new Queue("notification",{ // "notificat is name of queue"
    connection:{      // Will use Redis Connection server
        host: "localhost",
        port: 6379
    }
});

module.exports = notificationQueue

