// const express = require('express')
// const app = express()
// const port = 3000

// app.get('/', (req, res)=>res.send('Hello World!'))

// app.listen(port, () => console.log(`Example app listening on port ${port}`))

// init project
const express = require('express');
const bodyParser = require('body-parser');
const url = require('url')
const requestPromise = require('request-promise');;
const app = express();

 // general config
app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({extended : true}));

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// Tell Express where our templates are
app.set('views', './views');

// rerouts to the webview
app.get('/', function(request, response) {
  return response.redirect('/submit_form');
});

// shows the webview
app.get('/submit_form', function(request, response) {
  // Get user id and block name from request.body
  const {userId, blockName} = request.query;
    
  response.render('indet', {pageTitle: 'Executive Residence', userId, blockName});
});

// data obtained from the form are obtained from url and 
app.post('/submit_form_with_get', function(request, response) {
  const botId = process.env.CHATFUEL_BOT_ID;
  const chatfuelToken = process.env.CHATFUEL_TOKEN;
  
  const {userId , blockName} = request.body;
  
// url for brodcasting to the second template
  const broadcastApiUrl = `https://api.chatfuel.com/bots/${botId}/users/${userId}/send`;
  
  const query = Object.assign({
      chatfuel_token: chatfuelToken,
      chatfuel_block_name: blockName
    },
    request.body
  );
  
  const chatfuelApiUrl = url.format({
    pathname: broadcastApiUrl,
    query
  });
  
  const options = {
    uri: chatfuelApiUrl,
    headers: {
      'Content-Type': 'application/json'
    }
  };
    
  requestPromise.post(options)
    .then(() => {
      response.json({});
    });
});

// listen for requests :) (Not my code found it here)
const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});

// show buttons for the webview(s) at facebook 
app.get('/show-buttons', (request, response) => {
  
  const {userId, blockName} = request.query;
  
//   link to the webview
  const displayUrl = `https://branch-spring.glitch.me/submit_form?userId=${userId}&blockName=${blockName}`;

  response.json({
    messages:[
      {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'generic',
            image_aspect_ratio: 'square',
            elements: [{
              title: `Kindly make your Reservations:`,
              subtitle: 'Choose your preferences',
              buttons:[
                {
                  type: 'web_url',
                  url: displayUrl,
                  title: 'Click here',
                  messenger_extensions: true,
                  webview_height_ratio: 'tall' // Medium view
                }
              ]
            }]
          }
        }
      }
  ]
  }); 
});
