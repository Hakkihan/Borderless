![SystemDesign](https://github.com/user-attachments/assets/8c305f31-8d67-4ae8-b4c8-1e5f3b65b6a8)

Full-Stack System Architecture
Overview
This repository is a full-stack application that leverages modern technologies to provide scalable, maintainable, and efficient software. The architecture consists of the following key components:

Frontend: Next.js application for server-rendered React-based web interfaces.
Backend: Express.js application following the Controller-Service-Repository pattern for clean and organized code.
Database: Amazon RDS (PostgreSQL) for relational data storage.
File Storage: Amazon S3 for storing uploaded files such as images or documents.
System Design
1. Frontend
Framework: Next.js (React framework)
Features:
Server-side rendering (SSR)
Client-side rendering (CSR)
Static site generation (SSG)
API routes for auxiliary endpoints
UI Framework: Tailwind CSS or other styling libraries.
Responsibilities:
User interface and user experience (UI/UX).
Fetch data from backend REST APIs.
Display dynamic and static content.
2. Backend
Framework: Express.js
Organized using the Controller-Service-Repository pattern:
Controller: Handles HTTP requests and sends appropriate responses.
Service: Contains business logic and interacts with repositories or third-party services.
Repository: Manages direct interactions with the database.
Responsibilities:
API endpoints to handle data operations (CRUD).
Validates and sanitizes user input.
Communicates with the database and S3 for data storage and retrieval.
Error handling and logging.
3. Database
Technology: Amazon RDS (PostgreSQL)
Schema Design:
Passport Upload Table: Tracks user-uploaded passport images and metadata.
Data Extractions Table: Stores data extracted from the uploaded files.
Responsibilities:
Ensure consistency of relational data.
Support complex queries and transactions.
4. File Storage
Technology: Amazon S3
Usage:
Store uploaded files such as images or documents.
Generate signed URLs for secure file access.
Responsibilities:
Scalable and reliable storage for binary data.
Optimized for high availability and durability.
Application Flow
1. File Upload
User uploads a file from the frontend.
The file is sent to the backend via a REST API.
Backend validates the file and uploads it to S3.
Metadata (e.g., file location, upload time) is stored in the RDS database.
2. Data Retrieval
Frontend sends an API request to fetch data.
Backend retrieves relevant data from RDS.
Backend returns the data to the frontend for rendering.
3. Data Processing
Backend services interact with the database and/or S3 to process user input.
Complex operations like text extraction or image processing can be handled asynchronously (e.g., using AWS Lambda).

- **Backend Development:**
    - **Serverless API:** Admittedly due to time considerations a decision was made to take the fat-lambda approach. The more appropriate method would be to have each individual S.O.C as its own lambda 
                          and invoke triggers to maximise the scalability/serverless spirit.
    - **File Storage:** Images are being stored securely in an S3 bucket.
    - **Data Extraction:** Use AWS Textract to extract the date of birth and expiry date from the passport image. Use of and customization of the AWS Textract was necessary. Complex Regex was used to extract vital
                          info.
    - **Database Integration:** Storage of the extracted data in a PostgreSQL db where there is an uploadedPassport table and a DateExtracted table with a FK linking the two. In an enterprise application, a 
                                more sophisticated schema would be adhered to (potentially involving user data, authentications and many more tables, constraints, perhaps stored procs, etc).
    - **Error Handling and Logging:** Ensure errors are handled gracefully.
    
- **Frontend Development:**
    - **React Application:** Next.js frontend using TypeScript that allows users to upload passport images. Technologies include some basic demonstration of Tailwindcss and Tanstack query for the in-built caching 
                          mechanisms. Also use of the react-dropzone library which allows for users to upload files.
    - **Error Handling:** Implement error boundaries and provide user-friendly error messages. Tanstack query mutations handling the errors.
    - **Security:** Ensure that sensitive data is handled appropriately on the client side. In a real world application, .env environment variables will of course be stored in AWS systems manager / param store.
 
  Future Enhancements
Add Authentication: Use JWT or OAuth for secure access. Add user specific repositories
Optimize Database Queries: Use indexes and optimize query performance. Add users tables and add rules regarding uploads (are multiple uploads allowed, etc).
Enhance Scalability: Migrate backend to AWS Lambda in a more microservices-way and potentially implement caching with Redis.
Testing: Add playWright tests to the frontend and some unit/integration tests for the ExpressJS.
Error handling: utilise the global error handling helper function for further code readability, maintainability, etc.
Logging.

