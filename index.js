var admin = require("firebase-admin");
const functions = require('firebase-functions');
const express = require('express');
const bodyParser = require('body-parser');
const {WebhookClient} = require('dialogflow-fulfillment')

const app = express()
app.use(bodyParser.json());
const port = process.env.PORT || 3000;


app.post('/dialogflow-fulfillment', (request, response) => {
    console.log("Test")
})

app.get('/', (request, response) => {
    console.log("home")
})

app.listen(port, ()=>{
    console.log(`Listening to port ${port}`)

})