**Job Application Platform**
=============================

:briefcase: **Overview**
-----------

This repository houses a full-stack web application with authentication for login, sign up, reset password and account activation.Designed to facilitate job posting and application processes. Employers can create and manage job listings, while job seekers can apply, withdraw applications, and track their status. The platform supports multiple approvals for a single job position and one can track their job history 

## Image Previews
![alt text](<./images/job image (4).png>) 
![alt text](<./images/job image (5).png>) 
![alt text](<./images/job image (1).png>)
![alt text](<./images/job image (6).png>) 
![alt text](<./images/job image (2).png>) 
![alt text](<./images/job image (3).png>) 


**Technology Stack**
--------------------

:computer: **Frontend**: React, JavaScript, Tailwind CSS<br>
:snake: **Backend**: Python (Django), PostgreSQL, Redis<br>
:database: **Database**: PostgreSQL<br>
:signal_strength: **Real-time Communication**: Redis<br>

**Installation**
---------------

### Clone the repository

``` 
git clone https://github.com/001kenji/Job-Application.git ```<br>
cd job-application-platform
```

### Install Python dependencies:

``` pip install -r requirements.txt ```

### Install frontend dependencies
Open In Editor
```
cd frontend
npm install
```

### Start development servers
```
npm run dev
```
### Backend
activate vertual enviroment 
```
cd Messeger
python manage.py runserver
```
### Redis
``` 
sudo service redis-server restart
```
run redis<br>
```
redis-cli 
```
make sure to go though each file and replace important values and credentials.
