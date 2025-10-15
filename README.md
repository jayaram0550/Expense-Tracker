# Personal Expense Tracker (MERN Stack)

A full-stack web application for tracking personal expenses, built using the MERN (MongoDB, Express.js, React.js, Node.js) stack.

## Features

* **User Authentication:** Secure user registration, login, and logout using JWT (JSON Web Tokens).
* **Expense Management:**
    * Add new expenses with description, amount, category, and date.
    * View all recorded expenses.
    * Edit existing expense details.
    * Delete expenses.
    * Filter expenses by category.
* **Expense Summary:** View total expenses and a breakdown by category.
* **Responsive Design:** User-friendly interface that adapts to various screen sizes.

## Technologies Used

* **Frontend:**
    * React.js (for building the user interface)
    * React Router DOM (for navigation)
    * Axios (for making HTTP requests to the backend API)
    * React Context API (for global state management, e.g., authentication)
    * CSS (for styling)
* **Backend:**
    * Node.js (JavaScript runtime environment)
    * Express.js (web application framework for Node.js)
    * MongoDB (NoSQL database)
    * Mongoose (ODM for MongoDB)
    * JSON Web Tokens (JWT) (for authentication)
    * Bcrypt.js (for password hashing)
    * Dotenv (for managing environment variables)
    * CORS (for handling cross-origin requests)

## Setup and Running the Project Locally

**1. Prerequisites:**

* Node.js (v14 or higher) and npm (comes with Node.js) installed.
* A MongoDB database (either local or a cloud service like MongoDB Atlas).

**2. Clone the Repository (if applicable, otherwise, place the files as structured):**

If you eventually put this on GitHub, you'd start with:
```bash
git clone <your-repo-url>
cd expense-tracker-mern-stack