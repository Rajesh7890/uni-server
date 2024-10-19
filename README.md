# uni-server


**Project Overview**
=====================

The uni-server project is a personal server application designed to support various projects in MVC architecture, with a primary focus on a track expenses app and will later be use in other projects like Notification Tracker, ERP System and Media Hosting Server. The project utilizes Node.js, Express.js, and PostgreSQL as its core technologies.

**Project Structure**
---------------------

The project is organized into the following directories:

* `app.js`: The main application file, responsible for setting up the Express.js server and routing.
* `bin/www`: A script that starts the server.
* `controllers`: Contains controller files for handling business logic, such as `bookController.js` and `expenseController.js`.
* `models`: Houses model files for interacting with the database, including `book.js` and `expense.js`.
* `routes`: Defines routes for the application, including `books.js`, `expenses.js`, and `index.js`.
* `views`: Contains Jade template files for rendering HTML pages.
* `public`: Serves static assets, such as stylesheets and images.
* `db`: Includes database-related files, including the `db.sql` schema and `index.js` for database connections.

**Key Features**
----------------

* **Expense Tracking**: The application allows users to create, read, update, and delete expenses.
* **Book Management**: The app also provides basic CRUD operations for managing books.
* **Error Handling**: The application includes error handling mechanisms to catch and display errors.
* **Database Integration**: The project uses PostgreSQL as its database management system.

**Technologies Used**
----------------------

* **Node.js**: The JavaScript runtime environment for building the server-side application.
* **Express.js**: A popular Node.js web framework for building web applications.
* **PostgreSQL**: A powerful, open-source relational database management system.
* **Jade**: A templating engine for rendering HTML pages.
* **ESLint**: A JavaScript linter for maintaining code quality and consistency.

This information provides a high-level overview of the uni-server project. If you have specific questions or would like more details on certain aspects, feel free to ask!

Thanks for reading
\- RKS 😁
