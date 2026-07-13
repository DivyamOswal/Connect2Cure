# Connect2Cure

A modern telemedicine platform that bridges the gap between patients and healthcare professionals through secure, accessible, and intelligent digital healthcare.

![License](https://img.shields.io/badge/License-MIT-green)
![React](https://img.shields.io/badge/Frontend-React-61DAFB)
![Node.js](https://img.shields.io/badge/Backend-Node.js-339933)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248)
![Express](https://img.shields.io/badge/API-Express-black)

---

## Overview

Connect2Cure is a full-stack telemedicine platform developed to improve healthcare accessibility by connecting patients and doctors through a secure online platform. It enables appointment scheduling, digital medical records, online consultations, and AI-assisted symptom analysis, providing a seamless healthcare experience from anywhere.

---

## Features

### Patient Portal

- Secure Registration and Login
- Book and Manage Appointments
- AI-Based Symptom Checker
- Access Digital Medical Records
- View Prescription History
- Track Upcoming Consultations

### Doctor Portal

- Doctor Dashboard
- Manage Patient Appointments
- Access Patient Medical History
- Generate Digital Prescriptions
- Consultation Management

### Security

- JWT Authentication
- Password Encryption using Bcrypt
- Role-Based Access Control
- Secure API Communication
- Protected Medical Records

---

## System Architecture

```
                 +----------------+
                 |   React Client |
                 +--------+-------+
                          |
                      REST API
                          |
          +---------------+---------------+
          |                               |
      Express.js API                Authentication
          |                               |
      Business Logic                JWT Security
          |
     MongoDB Database
          |
Patients • Doctors • Appointments
      Medical Records
```

---

## Technology Stack

### Frontend

- React.js
- HTML5
- CSS3
- JavaScript
- Bootstrap

### Backend

- Node.js
- Express.js

### Database

- MongoDB

### Authentication

- JWT
- Bcrypt

### Development Tools

- Git
- GitHub
- VS Code
- Postman

---

## Project Structure

```
Connect2Cure/
│
├── client/
│   ├── public/
│   ├── src/
│   └── package.json
│
├── server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── server.js
│
├── README.md
└── package.json
```

---

## Installation

Clone the repository:

```bash
git clone https://github.com/DivyamOswal/Connect2Cure.git
```

Move into the project directory:

```bash
cd Connect2Cure
```

Install backend dependencies:

```bash
cd server
npm install
```

Install frontend dependencies:

```bash
cd ../client
npm install
```

---

## Environment Variables

Create a `.env` file inside the `server` directory.

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret
```

---

## Running the Project

Start the backend server:

```bash
cd server
npm start
```

Start the frontend application:

```bash
cd client
npm start
```

---

## Screenshots

| Home | Dashboard | Appointment |
|------|-----------|-------------|
| Add Screenshot | Add Screenshot | Add Screenshot |

---

## Future Improvements

- Video Consultation
- Online Payment Integration
- Mobile Application
- Email and SMS Notifications
- Multi-language Support
- AI-Based Health Recommendations
- Analytics Dashboard
- Electronic Health Record Integration

---

## Team

- Aaditya Shelke
- Divyam Oswal
- Vineet Reddy

---

## Academic Project

Bachelor of Technology (B.Tech)

Cloud Technology & Information Security

Ajeenkya DY Patil University

---

## Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a feature branch.

```bash
git checkout -b feature/new-feature
```

3. Commit your changes.

```bash
git commit -m "Add new feature"
```

4. Push the branch.

```bash
git push origin feature/new-feature
```

5. Open a Pull Request.

---

## License

This project is licensed under the MIT License.

---

## Acknowledgements

This project was developed as part of the Bachelor of Technology curriculum to demonstrate the practical implementation of cloud computing, full-stack web development, and secure healthcare application design.
