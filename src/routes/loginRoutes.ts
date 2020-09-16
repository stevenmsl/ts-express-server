import { Router, Request, NextFunction, Response } from "express";

/*
  - fix the inaccurate type definition
*/
interface RequestWithBody extends Request {
  body: { [key: string]: string | undefined };
}

function requireAuth(req: Request, res: Response, next: NextFunction): void {
  if (req.session && req.session.loggedIn) {
    next();
    return;
  }
  res.status(403);
  res.send("Not permitted");
}

const router = Router();

router.get("/login", (req, res) => {
  res.send(`
    <form method="POST">
      <div>
        <label>Email</label>
        <input name="email" />
      <div>
      <div>
      <label>Password</label>
      <input name="password" type="password" />
    <div>
    <button>Submit</button>
    </form>
  `);
});

router.post("/login", (req: RequestWithBody, res) => {
  /*
    - req.body is undefined if you do not configure
      bodyParser middleware
    - if req.body is defined that it has a type of 
      any
    - its type should actually be 
      { [key: string]: string | undefined }        
  */
  const { email, password } = req.body;

  if (email && password && email === "arlo@arlo.com" && password === "test") {
    req.session = { loggedIn: true };
    res.redirect("/");
  } else {
    res.send("You must provide an email");
  }
});

router.get("/", (req, res) => {
  if (req.session && req.session.loggedIn) {
    res.send(`
     <div>
      <div>Your are logged in</div>
      <a href="/logout">Logout</a>
     </div>
    `);
  } else {
    res.send(`
    <div>
     <div>Your are not logged in</div>
     <a href="/login">Login</a>
    </div>
   `);
  }
});

router.get("/logout", (req, res) => {
  req.session = null;
  res.redirect("/");
});

router.get("/protected", requireAuth, (req, res) => {
  res.send("Welcome to protected route, logged in user");
});

export { router };
