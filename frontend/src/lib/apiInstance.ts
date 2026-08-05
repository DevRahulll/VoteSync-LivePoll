import axios from "axios"
import {} from "sonner"

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000"

export const api = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
})
