import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import axios from "axios";
const app = express();
app.use(bodyParser.json());


app.post('/events', async (req, res) => {
    const { type, data } = req.body;
  
    if (type === 'CommentCreated') {
      const status = data.content.includes('orange') ? 'rejected' : 'approved';
  
      await axios.post('http://event-bus-srv:5000/events', {
        type: 'CommentModerated',
        data: {
          id: data.id,
          postId: data.postId,
          status,
          content: data.content
        }
      });
    }
  
    res.send({});
  });
  
  app.listen(5004, () => {
    console.log('Server is Listening on 5004');
  });