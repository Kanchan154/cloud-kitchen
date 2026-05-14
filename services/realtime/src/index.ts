import express from "express"
import { ENV } from "./config/ENV.js";
import cors from "cors";
import http from "http";
import { innitSocket } from "./socket.js";
const app = express();
import internalRoute from './routes/internal.route.js'
app.use(cors());
app.use(express.json());

app.use("/api/v1/internal", internalRoute);
const server = http.createServer(app);
innitSocket(server);

server.listen(ENV.PORT, () => {
    console.log(`Realtime server is listening to Port: ${ENV.PORT}`)
})