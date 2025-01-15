# GeoVote
GeoVote is an application that allows users to view popular polls in different areas, as well as create their own poll that other users can answer. 

This is a fullstack web application for managing polls, built with Django REST Framwork and React. Users can browse polls, manage their polls, answer others polls, and more. 

# Features 
User Management 
- User authentication with email and password
- User profiles with their own display name
- Protected routes for authenticated users

Poll Features 
- Browse polls with details (category, area)
- View answers to polls after choosing, or view answers for polls that are closed
- Dynamic map featuring heat spots for polls that are popular

Poll Library 
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

Then move into the folder
``` bash
   cd GeoVote
```

2. **Create and activate a virtual enviornment:**

``` bash
python -m venv (name of your env)
source (name of your env)/bin/activate
```

3. **Install the backend dependencies: 

``` bash
pip install -r requirements.txt
```