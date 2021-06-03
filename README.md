# Blogspot_BE_BS(NodeJS)
This is the backend Module where we have added REST API in NodeJS and data to be stored in JSON format with assets as Image folder.

## Getting Started
In the root directory of the project...

1. Install node modules - `npm install`.
2. Start development server - `node app.js`.

## Prerequisite

1. Install NodeJs on your system.(https://nodejs.org/en/)
2. Install POSTMAN for API testing.

## REST Endpoints
POST: http://localhost:3000/post/blogdetails  
GET: http://localhost:3000/get/blogdetails  
PATCH: http://localhost:3000/patch/blogdetails/8  
DELETE: http://localhost:3000/delete/10  
As per current impementation no database is required. However Mongodb can be added to as database  

## **Feature Implementation**
| 1  | Device Type  | Desktop/Tablet/Mobile  |  
|---|---|---|
| 2  | Uploading Blog  | Upload the blog details with text description,image files, publisher name author name.Use dynamic uploding of image choosen anywhere from machine.  |  
| 3  |  Comments |  Adding a comments in the form of text, image or both.Mention when people had commented. |  
| 4  |  Nesting of comments | You are able to comment on other comments and ability to add image feature in it.  | 
| 5  |  Close the blog | If blog is closed then its in read only you can not comment on such blog.(Do not delete anything once entered)  |  
| 6  |  Service Call |  Use Node JS for REST API through NodeJS calls. |  
| 7  | Storage  | Store Collected data in JSON format and render it immediately when user wishes.  |  
