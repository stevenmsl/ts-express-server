import express from "express";
import { router } from "./routes/loginRoutes";
import bodyParser from "body-parser";
import cookiSession from "cookie-session";
import { AppRouter } from "./AppRouter";
import "./controllers/loginController";
import "./controllers/rootController";

const app = express();

/*
  Why Express doesn't play nicely with TS
  - the middleware can add/modify properties to/on 
    an object, which makes it hard to predict the
    type as TS isn't aware of those changes. For 
    example, in the case of bodyParser middleware,
    it adds a body property to the request object.
  - things get worse once the body is added as its
    type is any.
  - in the type definition file for Express it 
    does say body property exists on Request 
    object. This already assumes that you will 
    use bodyParser.      
*/

/*
  - how you add middleware the order matters
*/
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookiSession({ keys: ["arlo"] }));
// app.use(router); // before refactoring
app.use(AppRouter.getInstance());

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
