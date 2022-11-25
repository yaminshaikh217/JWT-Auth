import express from "express";
import Jwt from "jsonwebtoken";
import Dotenv from "dotenv";
import mongoose from "mongoose";

const app = express();
// const uri = 'mongodb+srv://yaminshaikh217:Yamin%40217@cluster0.lzr0v.mongodb.net/shop?retryWrites=true&w=majority'
const uri = "mongodb://localhost:27017/test";
Dotenv.config();
app.use(express.json());

mongoose.connect(uri, (e) => {
  console.log("connnected");
  app.listen(8000);
});

// let Users = mongoose.model("user", {
//   name: String,
//   accessToken: String,
//   age: Number,
// });

const { Schema } = mongoose;
const userSchema = new Schema(
  { name: String },
  { accessToken: String },
  { timestamps: true }
);
const Users = mongoose.model("Users", userSchema);

app.post("/login", (req, res, next) => {
  const { name, password } = req.body;

  if (name) {
    const accessToken = Jwt.sign({name}, process.env.ACCESS_TOKEN_SECRET,{expiresIn:'1s'});
    const user = new Users({ name: name, accessToken: accessToken });
    user.save().then(() => res.json({ accessToken: accessToken }));

    // PRACTICING DATABASE QUIERS

    // Users.insertMany([
    //   { age: 1 },
    //   { age: 41 },
    //   { age: 17 },
    //   { age: 15 },
    //   { age: 13 },
    //   { age: 5 },
    //   { age: 6 },
    // ]);
    // Users.find({ age: { $lt: 20 } }).then((data) => {
    //   res.json(data);
    // });
  } else {
    res.sendStatus(400).json("Username not found");
  }
});

const verify = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];
    Jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403).json("Token is invalid");
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401).json("You are not authenticated!");
  }
};

app.post("/", verify, (req, res, next) => {});
