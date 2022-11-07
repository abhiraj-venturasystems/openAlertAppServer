import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

//import routes here
import shopRoutes  from './src/routes/shop.js';
import tokenRoutes  from './src/routes/token.js';

import globalErrorHandler from './src/utils/GlobalErrorHandler.js';

const app = express();

//we can use express.json instead of body-parser (body-parser is a middleware)
//middleware is used to manipulate the request data (in b/w the request and handling of data)
app.use(express.json());

//CORS is shorthand for Cross-Origin Resource Sharing.  It is a mechanism to allow or restrict 
//requested resources on a web server depend on where the HTTP request was initiated. 
//This policy is used to secure a certain web server from access by other website or domain.
app.use(cors());

//writing an api keyword before all apis
app.use('/api/cms/shop', shopRoutes);
app.use('/api/cms/token', tokenRoutes);

//ERROR HANDLER
app.use(globalErrorHandler);

//connecting to DB
const DB_CONN_URL=process.env.DB_CONN;
const PORT=process.env.PORT;


//useNewUrlParser: true
//The underlying MongoDB driver has deprecated their current connection string parser. 
//Because this is a major change, they added the useNewUrlParser flag to allow users 
//to fall back to the old parser if they find a bug in the new parser. 
//You should set useNewUrlParser: true unless that prevents you from connecting

//Note that if you specify useNewUrlParser: true, 
//you must specify a port in your connection string, like mongodb://localhost:27017/dbname.

//The new url parser does not support connection strings that do not have a port, like mongodb://localhost/dbname.

//useUnifiedTopology: true
//You should set this option to true, except for the unlikely case 
//that it prevents you from maintaining a stable connection.
//If not set, the MongoDB driver defaults to using 30000 (30 seconds)

mongoose.connect(DB_CONN_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    //useCreateIndex: true
  }).then(()=> {
      console.log("Database Connected");
      app.listen(PORT, ()=> console.log(`Server running on port : ${PORT}`));
  }).catch((error) => {
      console.log("Database Connection Failed -", error);
  });