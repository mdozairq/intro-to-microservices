import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
app.use(bodyParser.json());
const events: object[] = [];

app.post("/events", (req, res) => {
  const event = req.body;

  events.push(event);

  axios.post("http://localhost:5001/events", event).catch((err) => {
    console.log(err.message);
  });
  axios.post("http://localhost:5002/events", event).catch((err) => {
    console.log(err.message);
  });
  axios.post("http://localhost:5003/events", event).catch((err) => {
    console.log(err.message);
  });
  axios.post("http://localhost:5004/events", event).catch((err) => {
    console.log(err.message);
  });
  res.send({ status: "OK" });
});

app.get("/events", (req, res) => {
  res.send(events);
});

app.listen(5000, () => {
  console.log("Server is Listening on 5000");
});