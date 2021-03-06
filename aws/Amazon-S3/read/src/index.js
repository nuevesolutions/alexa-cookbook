// alexa-cookbook sample code

// There are three sections, Text Strings, Skill Code, and Helper Function(s).
// You can copy and paste the entire file contents as the code for a new Lambda function,
//  or copy & paste section #3, the helper function, to the bottom of your existing Lambda code.


// 1. Text strings =====================================================================================================
//    Modify these strings and messages to change the behavior of your Lambda function
var myBucket = 'alexabucket12';      // replace with your own bucket name!
var myObject = 'hello.txt';          // replace with your own file name!

// 2. Skill Code =======================================================================================================


var Alexa = require('alexa-sdk');

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);

    // alexa.appId = 'amzn1.echo-sdk-ams.app.1234';
    // alexa.dynamoDBTableName = 'YourTableName'; // creates new table for session.attributes

    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    'LaunchRequest': function () {
        this.emit('MyIntent');
    },

    'MyIntent': function () {

        var myParams = {
            Bucket: myBucket,
            Key: myObject
        };

        S3read(myParams,  myResult => {
                console.log("sent     : " + JSON.stringify(myParams));
                console.log("received : " + myResult);

                this.emit(':tell', 'The S 3 file says, ' + myResult );

            }
        );

    },

    'AMAZON.HelpIntent': function () {
        this.emit(':ask', 'ask me a yes or no question.', 'try again');
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', 'Goodbye!');
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', 'Goodbye!');
    }

};

//    END of Intent Handlers {} ========================================================================================
// 3. Helper Function  =================================================================================================


function S3read(params, callback) {
    // call AWS S3
    var AWS = require('aws-sdk');
    var s3 = new AWS.S3();



    s3.getObject(params, function(err, data) {
        if(err) { console.log(err, err.stack); }
        else {

            var fileText = data.Body.toString();  // this is the complete file contents

            callback(fileText);

        }
    });
}
