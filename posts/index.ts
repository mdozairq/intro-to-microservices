import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import { v4 as uuidv4 } from "uuid";
import cors from "cors";
import axios from "axios";


const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts: any = {};

// app.get("/posts", (req: Request, res: Response) => {
//   res.send(posts);
// });

app.post("/posts/create", async (req: Request, res: Response) => {
  const id: string = uuidv4();
  const { title } = req.body;

  posts[id] = {
    id,
    title,
  };

  await axios.post("http://event-bus-srv:5000/events", {
    type: "PostCreated",
    data: {
      id,
      title,
    },
  });
  console.log(posts[id]);
  
  res.status(201).send(posts[id]);
});

app.listen(5001, () => {
  console.log('v2');
  console.log("Server in running on port:5001");
});
