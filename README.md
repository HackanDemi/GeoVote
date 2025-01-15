# GeoVote
GeoVote is an application that allows users to view popular polls in different areas, as well as create their own poll that other users can answer. 

This is a fullstack web application for managing polls, built with Django REST Framwork and React. Users can browse polls, manage their polls, answer others polls, and more. 

# Features 
**User Management**
- User authentication with email and password
- User profiles with their own display name
- Protected routes for authenticated users

**Poll Features**
- Browse polls with details (category, area)
- View answers to polls after choosing, or view answers for polls that are closed
- Dynamic map featuring heat spots for polls that are popular

**Poll Library** 
- Add a poll so others can answer
- Remove a poll
- View all active/deactivated polls

# Technology Used
Backend
- Django
- Django REST Framework
- PostgreSQL
- Token Authentication 

Frontend 
- React
- React Router DOM
- Tailwind CSS
- Material-UI

# Installation

## Backend (Django)

1. **Clone the repository:**
Open your command line and execute this : 

```bash
   git clone https://github.com/HackanDemi/GeoVote.git
```

Then navigate into the GeoVote directory
``` bash
   cd GeoVote
```

2. **Create and activate a virtual enviornment:**

``` bash
#TERMINAL
python -m venv (name of your env)

source (name of your env)/bin/activate
```

3. **Navigate into the backend directory:**

```bash
#TERMINAL   
cd backend
```

4. **Install the backend dependencies:**

``` bash
#TERMINAL
pip install -r requirements.txt
```

5. **Set up the PostgreSQL database:**

``` bash
#TERMINAL
createdb geovote_db
```

6. **Then migrate all the models into the database with these two commands**

``` bash
# TERMINAL
python manage.py makemigrations

python manage.py migrate
```

7. **Then you can run the backend server with this command:**

```bash
# TERMINAL   
python manage.py runserver
```

8. **Finally, you can open the backend server. It should look like this:**
> You'll be able to click the http://127.0.0.1:8000/ hyperlink, where you'll be able to look at the specific endpoints used for the project
```bash
# TERMINAL

Watching for file changes with StatReloader
Performing system checks...

System check identified no issues (0 silenced).
January 15, 2025 - 15:26:12
Django version 5.1.4, using settings 'GeoVote.settings'
Starting development server at http://127.0.0.1:8000/
Quit the server with CONTROL-C.
```

## Frontend (React)
1. **Navigate back to the GeoVote directory:**
```bash 
# TERMINAL  
cd ..
```

2. **Navigate to the frontend directory:**
```bash
# TERMINAL  
cd frontend
```

3. **Install all the frontend dependencies with:**
```bash
# TERMINAL  
npm install
```

4. **Then start the React server:**
```bash
# TERMINAL  
npm run dev
```

5. **Finally, open the frontend endpoint, the terminal should look like this:** 
> You'll be able to click on the http://localhost:5173 hyperlink which will open the project
```bash
# TERMINAL 

> frontend@0.0.0 dev
> vite

  VITE v4.3.3  ready in 172 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

