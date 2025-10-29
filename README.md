# Finance Manager App

A secure, full-stack personal finance application designed to help users efficiently track and manage their financial data. This project demonstrates proficiency in building robust REST APIs and modern component-based architecture.

---

## ✨ Key Features

* *Secure Authentication:* Implemented *JWT (JSON Web Token) Authentication* for secure, stateless user access across API endpoints.
* *Data Management API:* Robust *REST API* built with *Spring Boot* handles all CRUD operations (Create, Read, Update, Delete) for financial records.
* *Automation:* Configured a *Spring Boot scheduled task* to send automated daily email reminders to users.
* *Dynamic UI:* Responsive and dynamic user interface developed using *React*.

---

## 🛠 Tech Stack

### Backend

* *Framework:* *Spring Boot*
* *Language:* Java
* *Database:* *MySQL*
* *Build Tool:* *Maven*
* *Security:* JWT, Spring Security

### Frontend

* *Library:* *React*
* *Build Tool:* *Vite*
* *Language:* JavaScript
* *Styling:* HTML, CSS, Bootstrap

---

## 💻 Getting Started

Follow these steps to set up and run the application locally.

### Prerequisites

* Java Development Kit (JDK 17+)
* Node.js & npm
* A running instance of MySQL
* Maven
* Git (for cloning)

### 1. Backend Setup

1.  Clone the repository and navigate to the backend folder:
    bash
    git clone [https://github.com/mohitmeena25/finance-manager.git]
    cd finance-manager/backend
    
2.  Update your MySQL connection details (URL, username, password) in the appropriate configuration file (application.properties or application.yml).
3.  Build and run the application:
    bash
    mvn clean install
    java -jar target/backend-app-name.jar 
    # The backend runs on port 8081
    

### 2. Frontend Setup

1.  Navigate to the frontend directory:
    bash
    cd ../frontend
    
2.  Install dependencies:
    bash
    npm install
    
3.  Start the development server:
    bash
    npm run dev 
    # Vite typically starts on port 5173
    
    The application will open in your browser.

---

## 📞 Contact

* *LinkedIn:* [linkedin.com/in/mohitmeena252](https://linkedin.com/in/mohitmeena252)
* *Email:* mm6579327@gmail.com
