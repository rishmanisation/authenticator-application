# Authenticator Application

This is an application that performs the following functions:

1. User is allowed to login using Facebook.
2. Upon login, we first check whether the user is whitelisted. A whitelisted user is one who's email address is present in the database.
3. If the user is not whitelisted, an error message is displayed on the screen.
4. If the user is whitelisted, he is assigned a JWT. His information in the database is updated with profile information from Facebook, and his profile page is displayed. This page also shows a list of other users who are whitelisted, and provides a link to a form where the user can whitelist another user.

## Tech Used

1. NodeJS 10.15.3 LTS
2. Express 4.x
3. MySQL 5.7.25

In addition, there are a large number of external packages used which are mentioned in the provided package.json file.

## Local Usage

(NOTE: The following steps have been tested on an Ubuntu terminal but should work on another distros as well. Modifications to the commands may be necessary in such a case.)

1. Install all the necessary packages. Open a terminal, navigate to the folder that contains the package.json file and run:

    `npm install`

2. Set up the MySQL database. Use version 5.7.25. Create a table called `user_details` as follows, and insert a 'seed' record into the table (make sure this is the email address that you will be logging into Facebook with).

    ```
    CREATE TABLE user_details(
        user_id INT AUTO_INCREMENT PRIMARY KEY,
        email_id VARCHAR(100) UNIQUE,
        first_name VARCHAR(100),
        last_name VARCHAR(100)
    );

    INSERT INTO user_details(email_id, first_name, last_name)
    VALUES('test@user.com', 'xyz', 'abc');
    ```
    While the email ID should be something that you can log into Facebook with, you can enter any string for the first and last names, since the application will populate it with your Facebook details when you log in.

3. Sign up for API keys on the Facebook developers page.

4. Create a file called .env and add the following information to it:

    ```
    CLIENT_ID=<Client ID from Facebook Developers>
    CLIENT_SECRET=<Client secret from Facebook Developers>
    DB_HOST=localhost (for local use)/mysql (for Docker)
    DB_USER=<MySQL user>
    DB_USER_PASSWORD=<MySQL user password>
    DB_DATABASE=<Database created in MySQL>
    ```

5. Run the server using one of the following three commands. It runs on port 8080.

    ```
    npm start

    node index.js

    nodemon index.js         (for this one you need to have nodemon installed)
    ```

6. In a browser window enter `http://localhost:8080` to access the application.

## Docker usage

   Use the docker-compose script to make sure the containers are properly set up. In the .env file make sure DB_HOST is set to mysql.

   ```
   docker-compose up
   ```
   
   Once the containers are up and running enter `http://localhost:8080` in a browser window to access the application.

## Views

1. GET '/': This is the main page. If the user is logged in it redirects to the profile page. Otherwise, a link to the login page is provided.

2. GET '/login': This is the login page. It consists of a single link that allows the user to login using Facebook.

3. GET '/login/facebook': Facebook login.

4. GET '/profile': This is the main user profile. It displays basic user information, a list of all whitelisted users and also contains the user's JWT.

5. GET '/whitelist': This is a page that allows the user to provide the email address of a person to be whitelisted. Assuming the email address is valid, the database is populated with the information.

6. POST '/whitelist': Accepts the email address of the user to be whitelisted.

## Known Issues

1. When you try to refresh the browser on the profile page, it will throw an error saying 'Authorization code has already been used'. This seems to be an issue with PassportJS middleware
and I am working on a fix.

2. If you click on the back button in the whitelist page and then visit the page again, it will still show the most recently found errors (if any). While functionality remains unaffected, this
is still something I am working to fix. EDIT: This has been fixed to some extent; however it does still do this on occasion.