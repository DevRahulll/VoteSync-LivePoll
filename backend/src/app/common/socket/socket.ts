import { Server } from "socket.io";
import type { Socket } from "socket.io";
import { Server as HttpServer } from "node:http";

let io: Server | null = null;
