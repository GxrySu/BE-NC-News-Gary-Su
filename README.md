This server will be hosted on heroku at: https://nc-news-garys.herokuapp.com/

To use the server all the endpoints so far, they are listed in the endpoints.json file

This is a server about news data which holds articles on different topics, this data can be accessed by the user. The user can make their own comments for each article and to do this they must provide a valid username with their comment. The user can also down and up vote the articles, delete comments by id number and filter the articles as they would like (e.g. title, topic, author  etc).

// First Step 

-Clone the database, which can be accessed via this link: https://github.com/GxrySu/BE-NC-News-Gary-Su.

-Once you have git cloned, you will need to install all the dependencies so that you can run the following code. (The version of the current dependencies might be outdated)

// Second Step

-Create two files .env.development & .env.test

-Within the files make sure to add `PGDATABASE=<database_name_here>` adding in the database names to the relevent files

// Third Step

-In the package.json file you will find "Scripts" these are npm codes you can run to get started.

-If you want to access the tests

-Make sure you have installed supertest and jest-sorted

    The minimum versions of the dependencies are as follows: 

        -dotenv: 16.0.3
        -express: 4.18.2
        -jest-sorted: 1.0.14
        -pg: 8.8.0
        -supertest: 6.3.0
        -jest: 27.5.1
        -node: 12.0.0
        -npm: 8.0.0