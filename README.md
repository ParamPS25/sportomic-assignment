# Sportomic - Sports Booking App

[Live Demo](https://sportomic-assignment.vercel.app/)



## Overview

Sportomic is a responsive web application for booking sports slots at various venues. It allows users to:

- Select a venue and view its details (including image, location, and available sports)
- Choose a sport and date to see available time slots
- Book available slots with a personalized username
- View their own bookings
- Experience real-time mock bookings by other users (The app simulates real-time booking updates by using client-side polling. Every 7 seconds, the frontend makes background requests to the backend to randomly book available slots on behalf of mock users. This keeps the UI dynamically updated, providing a near real-time experience



## Features

- Venue selection with detailed info and images
- Sport filtering based on selected venue
- Date selection for slot availability
- user name stored locally to provided booking history
- Real-time slot updates simulating other users booking slots
- Responsive layout optimized for mobile, tablet, and desktop



## Tech Stack

- React.js
- Tailwind CSS for styling and responsiveness
- Node.js / Express.js (with in-memomry data)
- Vercel and render for deployment


## Installation

### 1) Clone the Repository

```bash
git clone https://github.com/yourusername/sportomic-assignment.git
cd sportomic-assignment
```

### 2) Install Dependencies

```bash
npm install
```

### 3) Setup Environment Variables 
#### Create a .env file in the root of frontend
```bash
VITE_API_BASE_URL=http://localhost:3000
```

### 4) Run the Application

```bash
npm run dev
```


