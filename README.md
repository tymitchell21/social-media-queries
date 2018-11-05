# Assessment: Social Media Queries

For this assessment, you'll be writing a backend service that executes SQL
queries to manipulate rows in a database for a social media application. 

In doing so, you'll be demonstrating a basic understanding of the following:

- CRUD operations in the PostgreSQL dialect of SQL
- executing queries from a Node application
- combining data from multiple tables using SQL joins

## Getting Started
To get started, _fork_ this repository into your own GitHub account then clone
this repository to your local machine:

```console
foo@bar:~ $ git clone git@github.com:github-username/social-media-queries
foo@bar:~ $ cd social-media-queries
foo@bar:~/social-media-queries $
```

Note `github-username` above. In other words, __don't__ simply copy-paste the
code above blindly into a terminal. 

Next, create a database named 'social-media':
```shell
foo@bar:~/social-media-queries $ createdb social-media
```

## Acceptance Criteria
This assessment is divided into two parts:
1. The first part will have you practice writing raw SQL statements
2. Part two will have you executing SQL queries from Node

### Part 1 (4 points)
For each of the sections below, you'll be provided with a filename, and a
description of the operations that should be contained within that file. You
will receive __0__ points if the filename is incorrect (including casing). As
example, if you see the following:

```markdown

#### Step 0: ./queries/00_clear_database.sql
This script is responsible for clearing information from the database. It
should:
- remove all tables from the database
``` 
You would be expected to create a file named `00_clear_database.sql` inside of
the `queries` directory with the following contents:

```sql
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO public;
COMMENT ON SCHEMA public IS 'standard public schema';
```

You can then run the queries in the file with the following command:
```shell
foo@bar:~/social-media-queries $ psql -d social-media < ./queries/00_clear_database.sql
```

That said, the steps are meant to run sequentially (eg, all files in
`./queries` should run one after the other), so you'll instead want to test
your queries with the following command: 
```shell
foo@bar:~/social-media-queries $ for query in $(ls queries); do psql social-media < ./queries/$query; done
```
Yes, that's a for loop -- in BASH :-). Let's begin!

#### Step 0: ./queries/00_clear_database.sql
This script is responsible for clearing information from the database. It
should:
- remove all tables from the database

#### Step 1: ./queries/01_create_users_table.sql
This script is responsible for creating a 'users' table, which
represents...users of our application. It should:
- create a table named 'users' with:
    - an auto-incrementing id (serial primary key)
    - a username no longer than 15 characters (varchar)
    - a bio with no more than 255 characters (varchar)

#### Step 2: ./queries/02_create_posts_table.sql
This script is responsible for creating a 'posts' table, which represents all
posts created by users of the application. It should:
- create a table named 'posts' with:
    - an auto-incrementing id (serial primary key)
    - a title no longer than 50 characters (varchar)
    - a body no longer than 500 characters (varchar)
    - a user_id that **references** a user by id (integer)

#### Step 3: ./queries/03_insert_user.sql
This script is responsible for inserting an admin user into the database. It
should:
- insert user with:
    - a username of 'admin'
    - a bio of 'I am just a lonely administrator.'

#### Step 4: ./queries/04_insert_posts.sql
This script is responsible for inserting some posts into the database. It
should:
- insert a post with:
    - a title of 'Admin announcement'
    - a body of 'This API is awesome!'
    - a user_id that matches the admin user's id
- insert a post with:
    - a title of 'Just a test'
    - a body of 'This is just a test. I repeat, this is just a test.'
    - a user_id that matches the admin user's id

### Part 2 (6 points)
Start by initializing a project and installing the following
dependencies:
- `pg`: We'll be using this to execute SQL queries
- `express`: We'll be using this to create an HTTP server that executes SQL
  queries and returns JSON to the client

Next, add some code to start a server that connects to a database to `index.js`:
```javascript
const { Client } = require('pg');
const express = require('express');

// create an express application
const app = express();
app.use(express.json());
// create a postgresql client
const client = new Client({
    database: 'social-media'
});

// route handlers go here

// start a server that listens on port 3000 and connects the sql client on success
app.listen(3000, () => {
    client.connect();
});
```

For each section, you'll be given instructions that tell you exactly which
HTTP method the API endpoint should respond to, and how the information will
get from the client to the server.

For instance, if you see the following:
```markdown
#### Step 4: GET /users
This end point should respond with an array of all users
```

You would be expected to add the following code to `index.js` along with whatever code alredy exists:

```javascript
// route handlers go here
app.get('/users', (req, res) => {
    client.query('SELECT * FROM users', (err, result) => {
        res.send(result.rows);
    });
});
```

Entering `http://localhost:3000/users` in a browser (or Advanced Rest Client) would result in the following:
```json
[]
```

Good luck!

#### Step 6: GET /users
This end point should respond with an array of all users

#### Step 7: POST /users
This end point should take a new user as JSON and respond with that new user.

The user passed to the endpoint should include 'username', and 'bio', but
**not** the id. The response **should**, however, include whatever id the
database assigned to the new user.

Hint: You can pass variables to a query by [parameterizing](https://node-postgres.com/features/queries#parameterized-query) the query:
```javascript
const text = 'INSERT INTO users (username, bio) VALUES ($1, $2) RETURNING *';
const values = ['kenzie', 'Kenzie Academy is a user experience design and coding school in Indianapolis, Indiana. Our 6-month to 2-year program with 1-year paid apprenticeship is a new alternative to traditional colleges and short-term coding bootcamps. Students have the option of attending the program in person, or remotely via our Hybrid Program.'];
client.query(text, values, (err, result) => {
    console.log(result.rows[0]);
});
```

#### Step 8: GET /users/:id
This end point should respond with an object representing a single user with the matching id. 

Hint: `req.params` can be used to parse URL segments. That is, if I enter 'http://localhost:3000/users/1', `req.params` would be the following object:
```javascript
{ 
    id: 1
}
```

### Bonus (0 points)
If you find yourself with extra time (e.g., don't have other assessments to
catch up on), you may consider improving the quality in a number of ways:


#### Step 10: GET /users/:id with posts
Update this end point so that it returns a user along with their posts. If done
properly, your response should look something like this:
```javascript
{
    "username": "admin",
    "bio": "I am just a lonely administrator",
    "id": 1,
    "posts": [
        {
            "id": 1,
            "title": "Admin announcement",
            "body": "This API is awesome!"
        },
        {
            "id": 2,
            "title": "Just a test",
            "body": "This is just a test. I repeat, this is just a test."
        }
    ]
}
```

Hint, when you perform a join with `pg`, you'll get an array of objects by
default:
```javascript
[
    {
        "id": 1,
        "title": "Admin announcement",
        "body": "This API is awesome!",
        "username": "admin",
        "bio": "I am just a lonely administrator",
        "user_id": 1,
    },
    {
        "id": 2,
        "title": "Just a test",
        "body": "This is just a test. I repeat, this is just a test.",
        "username": "admin",
        "bio": "I am just a lonely administrator",
        "user_id": 1,
    }
]
```

As such, you'll want to find a way to traverse the array and make a single
object _and_ add a key of "posts" that is an array of just the post information,
as in the snippet in the previous section.

Consequently, this bonus activity highlights one of the benefits of using an ORM
like [sequelize](http://docs.sequelizejs.com/) for joins :-)

## Submission
You __do not__ have to submit a deployed application. Simply submit a link to
your github repository with the above steps (part 1 & 2) completed.
