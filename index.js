var admin = require("firebase-admin");
const functions = require('firebase-functions');
const express = require('express');
const bodyParser = require('body-parser');
const {WebhookClient} = require('dialogflow-fulfillment');

const cors = require('cors');
const dialogflow  = require('dialogflow');
const { response } = require("express");
const app = express()

app.use(bodyParser.json());
const port = process.env.PORT || 3000;

var serviceAccount;
if(process.env.NODE_ENV==='production')
{
  serviceAccount = JSON.parse(process.env.service_account)
}
else
{
  serviceAccount = require('./serviceAccount.json');
}

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://chatty-sfjb.firebaseio.com"
})


async function runSample(projectId = 'chatty-sfjb') {
    // A unique identifier for the given session
    const sessionId = 'dasd'
  
    // Create a new session
    const sessionClient = new dialogflow.SessionsClient({credential: serviceAccount});
  const sessionPath = sessionClient.sessionPath('chatty-sfjb','dasd');
  
    // The text query request.
    const request = {
      session: sessionPath,
      queryInput: {
        event: {
          "name": 'Welcome',
          "languageCode": 'en-US'
        },
        /*text: {          
          text: ' ',
          languageCode: 'en-US',          
        },*/
      },
    };
  
    // Send request and log result
    const responses = await sessionClient.detectIntent(request);

    
    console.log('Detected intent');
    const result = responses[0].queryResult;
    console.log(`  Query: ${result.queryText}`);
    console.log(`  Response: ${result.fulfillmentText}`);
    if (result.intent) {
      console.log(`  Intent: ${result.intent.displayName}`);
    } else {
      console.log(`  No intent matched.`);
    }
  }


app.post('/dialogflow-in', (request, response) => {
 console.log('WTF')
 runSample('chatty-sfjb')
  /*  cors(request, response, async ()=> {
        await sleep(1000)
        response.send('daaaiaii') 
        const {queryInput, sessionID} = request.body;

        const sessionClient = new SessionClient({credential: serviceAccount});
        const session = sessionClient.sessionPath('chatty-sfjb',sessionID);
        const responses = await sessionClient.detectIntent({session, queryInput});
        const result = responses[0].queryResult;
        response.send(result);
        console.log(result)
    })*/


})


//Receive intents
app.post('/dialogflow-fulfillment', (request, response) => {
    dialogflowFulfillment(request, response);
    //console.log("got " + request.body)
})

app.get('/', (request, response) => {
    console.log("home")
})

app.listen(port, ()=>{
    console.log(`Listening to port ${port}`)

})

const dialogflowFulfillment = (request, response) =>{
   console.log("fullfilled!")
    const agent = new WebhookClient({request, response});

    function sayHi(agent) {
        agent.add("Hi madafaca")
    }


    let intentMap = new Map();
    intentMap.set("UpdateProfile", sayHi);
    agent.handleRequest(intentMap);
}