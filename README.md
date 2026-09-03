# 🚨 RESQNET

## Real-Time Disaster Response Management Platform

RESQNET is a production-deployed MERN disaster-response management platform designed for coordinating emergency incidents, responders, shelters, resources, and operational decision-making through a centralized real-time command center.

GITHUB STACK:
React
Vite
Node.js
Express.js
MongoDB
Mongoose
Socket.IO
JWT
bcrypt
Leaflet
React Leaflet
Axios
Render
Vercel
OpenStreetMap


      ARCHITECTURE:
                 RESQNET
                    │
        ┌───────────┴───────────┐
        ↓                       ↓
  React + Vite            Node + Express
     Vercel                   Render
        │                       │
        ├──── REST / Axios ─────┤
        │                       │
        ├──── Socket.IO ────────┤
        │                       │
        ↓                       ↓
     Leaflet               MongoDB Atlas
        │
        ↓
 OpenStreetMap
