// yarn add express to get dependency
// Make sure you make an index.js file "touch index.js"
// node index.js will start server. To kill do control C
// If listening will not update so have to restart server by killing it or use nodemon to autolisten by doing 'yarn server'
// Use 'yarn server' so dont have to update and kill server over and over to see updates.
// "start": "node index.js" type this into scripts in package to do yarn start instead
// require is a node thing that makes you need outside third parties like express
// .listen and express is from express
// express has two objects req(everything do what receiving from client) and res(deals what we sending back to client);
// express has status and default error is status 200.
// res.json is same as res.send but sends back json(it's a stringifed object that must be done to send objects)


const express = require('express');
// express = lightweight
// routers --> organizing our endpoints
// middleware --> allows us expand and customize

const db = require('./data/db.js');

const server = express();
 // const hubs = db.hubs
const { hubs } = db;

// middleware
// Include this to help us see what's on our req.body
// This is express
server.use(express.json());

// request handler for /now that sends back the current date in string form

server.get('/now', (req, res) => {
    const now = new Date().toISOString();
    res.send(now)
});

// creating endpoints
// .get means I want to make something available in case anyone needs
// will see console log when save and then refresh page
// server.get('/', (req, res) => {
//     console.log('inside the get request')
//     // specify data type
//     // set a status code
//     // send a response
//     res.send('<h2> Hello World</h2>')
// });


// Read - send back a list of all hubs

server.get('/hubs', (req, res) => {
  // get the hubs from the db
  // sometimes gets error bcuz in db.js depends on time just for us to play around
  hubs.find()
    .then(allHubs => {
        res.json(allHubs);
    })
    // fancy catch
    .catch(({ code, message }) => {
        res.status(code).json({ err: message });
    });
    // regular catch
    // .catch(err => {
    //     res.status(500).send(err);
    // }) 
  // then send them back
});


// Create - add a nw hub to the list
// status 201 tells us something was created
// Have to use Postman
// Postman -> Body, raw, Json, POST localhost9090/hubs, keys hav double quotation
// in textfield to test do {"name": "my favorite hub"}. If worked should show up on /hubs added to the array of objects
// if restart server will lose new info in database since the way set up for this guided project
// to debug do console.log and then do send in Postman then check terminal
server.post('/hubs', (req, res) => {
  const newHub = req.body;
  console.log('req body', req.body)
  hubs.add(newHub)
   .then(addedHub => {
     res.status(201).json(addedHub)
   })
   .catch(({ code, message }) => {
    res.status(code).json({ err: message });
});
});


// Delete - remove a hub
// expects an id
// Postman delete do /hubs/3 (hubs with id 3 in our example) then click send. Check by doing Get /hubs to see if id 3 was removed
server.delete('/hubs/:id', (req, res) => {
    const { id } = req.params;

    hubs.remove(id)
    .then(removedHub => {
        res.json(removedHub);
    })
    .catch(({ code, message }) => {
        res.status(code).json({ err: message });
    });
})



// Update - edit a hub
// Postman - Put /hubs/2, in text change "name": "bobby", then check on get /hubs
server.put('/hubs/:id', (req, res) => {
    const { id } = req.params;
    const changes = req.body;

    hubs.update(id, changes)
    .then(updatedHub => {
        if(updatedHub) {
            res.json(updatedHub);
        } else {
           res.status(404).json({ err: 'incorrect id' });
        }
    })
    .catch(({ code, message }) => {
        res.status(code).json({ err: message });
    });
})

// Read by Id - Find user by id
// Postman - Get /hubs/2 then click send and should bring up specific user with that Id
server.get('/hubs/:id', (req, res) => {
    const { id } = req.params;

    hubs.findById(id)
      .then(hubById => {
        res.json(hubById)
      })
      .catch(({ code, message }) => {
        res.status(code).json({ err: message });
    });
})


// listening
server.listen(9090, () => {
    console.log('Listening on port 9090')
});

