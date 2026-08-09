# Connect2Cure

A modern full-stack telemedicine platform that connects patients and healthcare professionals through secure, accessible, and intelligent digital healthcare services.

---

## Overview

**Connect2Cure** is a full-stack telemedicine platform designed to improve healthcare accessibility by connecting patients and doctors through a secure digital platform.

The platform provides functionality for appointment management, digital medical records, prescriptions, online consultations, AI-assisted healthcare features, document processing, and secure image/file storage.

The project was developed collaboratively as part of a Bachelor of Technology project, with responsibilities spanning application development, deployment, cloud configuration, integration, and troubleshooting.

---

## Features

### Patient Portal

* Secure registration and login
* Book and manage appointments
* AI-assisted symptom analysis
* Access digital medical records
* View prescription history
* Track upcoming consultations
* Upload and manage medical documents
* Access consultation information

### Doctor Portal

* Doctor dashboard
* Manage patient appointments
* Access patient medical history
* Generate digital prescriptions
* Consultation management
* Manage patient records

### Healthcare & AI Features

* AI-assisted symptom analysis
* Medical document processing
* PDF generation and processing
* OCR-based document processing
* Digital medical records
* Prescription management

### Communication

* Real-time communication using Socket.IO
* Online consultation support
* Appointment-based patient/doctor interaction

### Security

* JWT-based authentication
* Password hashing using Bcrypt
* Role-based access control
* Protected API routes
* Environment-based secret management
* Secure handling of application credentials

---

## Cloud & Deployment

Connect2Cure uses cloud services for application deployment and asset management.

### Frontend Deployment

The React/Vite frontend is configured for deployment on **Vercel**.

```text
GitHub Repository
       |
       v
React + Vite Client
       |
       v
     Vercel
       |
       v
 Production Web Application
```

### Image & File Storage

**Amazon S3** is used for cloud-based image/file storage.

```text
Application
     |
     v
Backend API
     |
     v
Amazon S3
     |
     v
Images / Uploaded Files
```

This keeps application assets separate from the application server and allows files to be stored and retrieved through cloud object storage.

### Environment & Credentials

Sensitive configuration such as database connection strings, JWT secrets, API keys, cloud credentials, and other application secrets are supplied through environment variables.

Sensitive credentials are not stored directly in the source code.

---

## System Architecture

```text
                         +----------------------+
                         |     User Browser     |
                         +----------+-----------+
                                    |
                                    v
                         +----------------------+
                         |   React + Vite       |
                         |      Frontend        |
                         +----------+-----------+
                                    |
                              REST API /
                              Socket.IO
                                    |
                                    v
                         +----------------------+
                         | Node.js + Express    |
                         |      Backend         |
                         +----------+-----------+
                                    |
             +----------------------+----------------------+
             |                      |                      |
             v                      v                      v
      +-------------+        +-------------+        +-------------+
      |   MongoDB   |        |  Amazon S3  |        |   Upstash   |
      |  Database   |        | Image/File  |        |    Redis    |
      |             |        |   Storage   |        |             |
      +-------------+        +-------------+        +-------------+
             |
             v
   Patients / Doctors
   Appointments
   Medical Records
   Prescriptions

                         +----------------------+
                         |   External Services  |
                         +----------+-----------+
                                    |
                     +--------------+--------------+
                     |                             |
                     v                             v
                OpenAI API                    Stripe
             AI-assisted features          Payment Support
```

---

## Technology Stack

### Frontend

* React.js
* Vite
* JavaScript
* HTML5
* CSS3
* Bootstrap

### Backend

* Node.js
* Express.js
* REST APIs
* Socket.IO
* Multer

### Database

* MongoDB
* Mongoose

### Cloud & Infrastructure

* Amazon S3
* Vercel
* Upstash Redis

### Authentication & Security

* JSON Web Tokens (JWT)
* Bcrypt
* Environment Variables
* Role-Based Access Control

### AI & Document Processing

* OpenAI API
* Tesseract.js
* PDF processing
* PDF generation
* Sharp image processing

### Development & Testing

* Git
* GitHub
* VS Code
* Postman
* Nodemon

---

## Project Structure

```text
Connect2Cure/
│
├── api/
│
├── client/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── vercel.json
│
├── server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── server.js
│   └── package.json
│
├── README.md
└── .gitignore
```

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/DivyamOswal/Connect2Cure.git
```

Move into the project directory:

```bash
cd Connect2Cure
```

### 2. Install Backend Dependencies

```bash
cd server
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../client
npm install
```

---

## Environment Variables

Create a `.env` file inside the `server` directory.

Example:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
AWS_S3_BUCKET=your_s3_bucket

OPENAI_API_KEY=your_openai_api_key

REDIS_URL=your_redis_url

STRIPE_SECRET_KEY=your_stripe_secret_key
```

> **Important:** Never commit real credentials, API keys, access keys, or secrets to the repository.

The exact environment variables required may vary depending on the deployment environment and enabled application features.

---

## Running the Project

### Start the Backend

```bash
cd server
npm start
```

For development:

```bash
npm run dev
```

### Start the Frontend

```bash
cd client
npm start
```

The frontend communicates with the backend through the configured API endpoints.

---

## Deployment

The frontend is configured for deployment using **Vercel**.

The deployment process involves:

```text
Development
     |
     v
Git / GitHub
     |
     v
Frontend Build
     |
     v
Vercel Deployment
     |
     v
Production Application
```

The backend requires its production environment to be configured with the required database connection, authentication secrets, cloud storage credentials, API keys, and other environment-specific configuration.

---

## AWS S3 Integration

Amazon S3 is used for storing application images and uploaded assets.

The backend uses the AWS SDK to communicate with S3.

```text
User Upload
     |
     v
React Frontend
     |
     v
Express API
     |
     v
AWS S3
     |
     v
Stored Image / File
```

This provides scalable object storage while keeping uploaded assets separate from the application server.

---

## Screenshots

| Home           | Dashboard      | Appointment    |
| -------------- | -------------- | -------------- |
| Add Screenshot | Add Screenshot | Add Screenshot |

---

## Development & Deployment Responsibilities

The project involved both application development and deployment-related work, including:

* Full-stack application development
* Frontend and backend integration
* Production deployment
* Frontend deployment configuration
* AWS S3 integration
* Cloud storage configuration
* Environment variable configuration
* Application credential configuration
* Production troubleshooting
* Runtime and deployment issue resolution
* API integration and testing

---

## Future Improvements

* Video consultation improvements
* Online payment integration
* Mobile application
* Email and SMS notifications
* Multi-language support
* Advanced AI-based health recommendations
* Analytics dashboard
* Electronic Health Record integration
* Improved monitoring and observability
* Automated CI/CD pipeline

---

## Team

* **Aaditya Shelke**
* **Divyam Oswal**
* **Vineet Reddy**

---

## Academic Project

**Bachelor of Technology (B.Tech)**
**Cloud Technology & Information Security**

**Ajeenkya DY Patil University**

---

## Contributing

Contributions are welcome.

1. Fork the repository.

2. Create a feature branch:

```bash
git checkout -b feature/new-feature
```

3. Commit your changes:

```bash
git commit -m "Add new feature"
```

4. Push the branch:

```bash
git push origin feature/new-feature
```

5. Open a Pull Request.

---

## License

This project is licensed under the MIT License.

---

## Acknowledgements

This project was developed as part of the Bachelor of Technology curriculum to demonstrate the practical implementation of full-stack development, cloud computing, cloud storage, secure authentication, AI-assisted healthcare functionality, and production deployment.
