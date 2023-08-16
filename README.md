# Camp-Scape
![image](https://github.com/ERRAYGON/Camp-Scape/assets/99887251/ae7ef073-39e2-4d83-84a3-fa2d0f314977)


CAMPSCAPE is a website where users can create and review campgrounds. To review or create a campground, an account is mandatory. This project was part of Colt Steele's web development course on Udemy.

This endeavor was developed using Node.js, Express, MongoDB, and Bootstrap. Passport.js facilitated the authentication process.

**Features:**

1. Users can create, edit, and delete campgrounds.
2. Users can write reviews for campgrounds, modify their reviews, and delete them.
3. User profiles encompass additional information about the user (full name, email, phone number, join date), their campgrounds, and the option to update their profile or deactivate their account.
4. Campgrounds can be searched by name or location.
5. Campgrounds can be sorted by highest rating, most reviewed, lowest price, or highest price.
    Running Locally:

**Install MongoDB.**
1. Create a Cloudinary account to obtain an API key and secret code.
2. Clone the repository: git clone https://github.com/leovenom/CampScape.git
3. Navigate to the project directory: cd CampScape
4. Install dependencies: npm install
5. Create a .env file in the project root and add the following:
   arduino

**Copy code**
DATABASEURL='<url>'
API_KEY='<key>'
API_SECRET='<secret>'

In a separate terminal window, run mongosh. In the project terminal, execute **node app.js**.
Access the website at **localhost:3000**.

**Technologies Used:**
Node.js: JavaScript runtime built on Chrome's V8 JavaScript engine.
Express: Fast, unopinionated, minimalist web framework for Node.js.
MongoDB: Database for modern applications.
Mongoose: Elegant MongoDB object modeling for Node.js.
EJS: Embedded JavaScript templating.


**Note**: To implement Google Maps functionality, refer to the provided resource.
