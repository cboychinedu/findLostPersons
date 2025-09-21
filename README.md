# Finding Missing Persons

<img src="./images/homePage.png" alt="Home Page" >

<img src="./images/imageAnalysis.png" alt="Image Analysis/Video Analysis" >

<img src="./images/videoAnalysis.png" alt="Video Analysis">


<h3> Find Missing Persons: A Machine Learning Analysis Application </h3>

<h4> Project Overview </h4> 

<p>

The Find Missing Persons application is a powerful, full-stack web tool designed to assist in locating missing individuals through advanced media analysis. The platform provides a secure dashboard where authorized users can upload images and videos for real-time analysis, detecting persons of interest and providing immediate feedback. <br>

This project demonstrates a complete development cycle, from building a responsive user interface with React and Tailwind CSS to creating a robust backend with Node.js, Express, and Socket.IO for real-time communication. <br>

This project is a web application designed to help find and report lost persons. It provides a platform for users to register, report missing individuals, and access information about ongoing cases.

</p>


## Technologies Used
- React
- Python 
- Nodejs 
- Typescript 
- CSS Modules (Tailwind CSS)
- Tensorflow 
- JavaScript

<h3> Key Features </h3>
<p> 
<ul>
<li> <b> User Authentication: </b> Secure login and registration system. </li> 
<li> <b> Media Upload & Analysis: </b> Upload images and videos to be processed by a backend analysis engine trained on the missing persons images and data </li> 
<li> <b> Real-time Progress Tracking: </b> Live updates on the analysis progress via a WebSocket connection. </li> 
<li> <b> Live Detection Events: </b> Receive instant notification when a person is detected in a video stream. </li> 
<li> <b> Responsive Design: </b> A modern, mobile-first user interface that adapts to all screen sizes. </li> 
<li> <b> Persistent Storage: </b> Manager user data and analysis results. </li> 
</ul>
</p>


<h3> Technologies Used </h3> 
<h4> Frontend </h4> 
<p> 
<ul>
<li> React: A javascript library for building user interfaces </li> 
<li> Tailwind CSS: A utility first CSS framework for rapid UI development. </li> 
<li> Socket.IO Client: Enables real-time, bidirectional communication between the clinet and server. </li> 
<li> Axios: A promise-based HTTP client for making API requests. </li> 
</ul>
</p>

<h4> Backend </h4>

<p>
<ul>
<li> Node.js & Express: A robust and scalable backend runtime and web framework. </li>

<li>TypeScript: A typed superset of JavaScript that compiles to plain JavaScript.</li>

<li>Socket.IO: A library for building real-time applications. </li>

<li>JWT (JSON Web Tokens): For secure user authentication and authorization.</li>

<li>ts-node-dev: For live reloading during development, automatically recompiling TypeScript files on changes.</li>

<li>Bcrypt: For hashing user passwords securely.</li>
</ul>
</p>

<h3> Getting Started </h3> 

<p> Follow these steps to set up the project locally </p>

<h4> Prerequisites </h4> 
<p> You must have <b> Nodejs, npm, python3 </b> installed on your machine </p> 

<h4> 1. Backend Setup </h4> 
<p> First, set up the Nodejs backend to handle API requests and real time communication </p>

<h3> Installation </h3> 

1. Clone the repository for ssh:
   ```bash
   git clone git@github.com:cboychinedu/findLostPersons.git
   
   cd findLostPersons/

   cd backend/ 
   ```
2. Install dependencies: 
   ```bash
   npm install . 
   ```
3. Start the development server:
   ```bash
   npm start
   ```

<h4> 2. Python Backend Setup </h4> 
<p> 
Open another terminal and navigate to where the findLostPersons folder is located. <br> 

Once you find it, navigate into the folder and change your directory into the <b> mlServer </b>
</p>

1. Change directory into the mlServer 

```bash 
  $ cd mlServer/ 
```

2. Install the required dependencies 
```bash
  $ pip install -r requirements.txt 
```

3. Start the machine learning server 
```bash 
$ python app.py 
```

<h3> 3. React Server Setup </h3> 




