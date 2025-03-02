# *Integration Architectures* MEAN-Stack Semester Project

## Tech Stack
1. **MongoDB**: A NoSQL database that stores data in flexible, JSON-like documents, allowing for easy scalability and data retrieval.
2. **Express.js**: A web application framework for Node.js that simplifies the process of building robust APIs and web applications.
3. **Angular**: A platform and framework for building single-page client applications using HTML and TypeScript, providing a rich user experience.
4. **Node.js**: A JavaScript runtime built on Chrome's V8 engine that allows for server-side scripting and building scalable network applications.

## Context

A fictional company uses multiple systems for managing its Salesmen: OrangeHRM, OpenCRX, Odoo. The Head of HR Department dislikes the fact that she has to manually jump between multiple systems just to complete the simple task of creating Performance Evaluations and Bonus Salary Records for the individual Salesmen, then having the CEO and the Salesmen accept these Bonuses. Our task was to create a Fullstack Web Application, which acts as an Integration Platform between these Systems to help centralize the process using the MEAN-Stack. The project is a great display of the knowledge and skills we have accumulated during our study at Hochschule Bonn-Rhein-Sieg, especially during the Module Integration Architecture.

## Development Process

We first developed the Backend using Node.js, which both consumes the available APIs (REST API for OrangeHRM & OpenCRX, XML-RPC for Odoo) and presents a REST API for the Frontend. The collected data from other systems and newly created data are all stored in MongoDB as Documents. Then the Frontend was designed using Figma and constructed using Angular. The design of the Frontend was heavily focused on Schemas such as Security by Design, Role-based Access Control, and Zero Trust Policy.

### Result

The final product is a fully functional web application that streamlines the process of creating Performance Evaluations and Bonus Salary Records. The application integrates seamlessly with the existing systems, providing a user-friendly interface for the HR department and Salesmen.

Key functionalities include:
- Data are queried from OrangeHRM and OpenCRX using REST API, and Odoo using XML-RPC.
- The application can support multiple users with different roles and also supports role creation in the frontend.
- HR can add Social Performance.
- Annual evaluations and the corresponding bonus salaries will be automatically generated.
- The evaluations have to be accepted by HR, CEO, and the corresponding Salesmen before the bonus salary records are ready to be pushed to OrangeHRM via a POST request.
- The CEO can add remarks/comments to each individual evaluation, and these remarks will be stored persistently and can be accessed read-only by HR and the corresponding Salesmen.

Security functionalities include:
- Role-based access control.
- Each and every request from frontend to backend is automatically authenticated & authorized (zero trust policy).
- MongoDB tables are password protected.
- Cross-Origin Resource Sharing is strictly configured.

To see the application in action, watch the demonstration video below:

[Demo Video](https://drive.google.com/file/d/1iOWvpXtGGEwRmEMjrdLH2g-SItN5f_HN/view?usp=sharing "Demo Video")

## Installation
Assuming you have access to the Hochschule Bonn-Rhein-Sieg's intranet (either through one of the internal internet connections or through a VPN tunnel) since access to the private installation of OrangeHRM, OpenCRX and Odoo are prerequisite for running the program.

To run this project locally, follow these steps:

1. Clone the repository:
```bash
git clone https://github.com/justKMM/IRA-Bonus-Salary-Manager.git
```
   
2. Navigate to the project directory:
```bash
cd IRA-Bonus-Salary-Manager
```

3. Install the dependencies for the backend:

```bash
cd backend
npm install
```

4. Install the dependencies for the frontend:
```bash
cd ../frontend
npm install
```

5. Start the backend server:
```bash
cd ../backend
npm start
```

Start the frontend application:

```bash
cd ../frontend
ng serve
```

Now you can access the application at http://localhost:4200.

## Acknowledgments

We would like to express our sincere gratitude to our professor, Prof. Dr. Alda Sascha, and the teaching assistant, Lucas Ringhausen, for their invaluable support and guidance throughout this project. Their insights and feedback greatly contributed to the success of our work.
