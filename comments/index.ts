import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import { v4 as uuidv4 } from "uuid";
import cors from "cors";
import axios from "axios";


const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId: any = {};

app.get("/posts/:id/comments", (req, res) => {
    res.send(commentsByPostId[req.params.id] || []);
  });
  
  app.post("/posts/:id/comments", async (req, res) => {
    const commentId = uuidv4();
    const { content } :{content: string}= req.body;
  
    const comments = commentsByPostId[req.params.id] || [];
  
    comments.push({ id: commentId, content, status: "pending" });
  
    commentsByPostId[req.params.id] = comments;
  
    await axios.post("http://localhost:5000/events", {
      type: "CommentCreated",
      data: {
        id: commentId,
        content,
        postId: req.params.id,
        status: "pending",
      },
    });
  
    res.status(201).send(comments);
  });
  
  app.post("/events", async (req, res) => {
    console.log("Event Received:", req.body.type);
  
    const { type, data } = req.body;
  
    if (type === "CommentModerated") {
      const { postId, id, status, content } = data;
      const comments = commentsByPostId[postId];
  
      const foundcomment = comments.find((comment:any) => {
        return comment.id === id;
      });
      foundcomment.status = status;
  
      await axios.post("http://localhost:5000/events", {
        type: "CommentUpdated",
        data: {
          id,
          status,
          postId,
          content,
        },
      });
    }
  
    res.send({});
  });
  
  app.listen(5002, () => {
    console.log("Server in running on port:5002");
  });
