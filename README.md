
#  EdTechBook

**EdTechBook** is a full-stack, responsive e-learning platform that allows users to browse, purchase, and consume educational courses, while enabling admins to create and manage course content with lessons. Built with a modern MERN stack architecture, EdTechBook emphasizes clean UI, dynamic lesson rendering, and secure authentication.

>  This project is under continuous development. Screenshots and demo walkthrough will be added soon.

---

##  Tech Stack

| Layer         | Tech                                    |
|--------------|-----------------------------------------|
| **Frontend** | React (Create React App), CSS           |
| **Backend**  | Node.js, Express.js, JWT, Bcrypt   |
| **Database** | MongoDB Atlas (Cloud)                   |
| **Auth**     | JSON Web Token (JWT), Bcrypt.js         |

---

##  Project Structure

```bash
EdTechBook/
├── backend/           # Express API for user/admin/course routes
├── frontend/          # User-facing React application
├── adminfrontend/     # Admin dashboard frontend (React)
├── README.md          # You're here!
````

---

## 🚀 Features

###  User Interface

* Signup / Login modal-based authentication
* Browse available courses from `/api/v1/course/preview`
* Purchase courses (JWT-based token authorization)
* Access purchased course with lesson player
* Responsive UI with clean transitions

### Admin Interface

* Admin Signup / Login (separate dashboard)
* Create new courses with title, description, image, and lessons
* Edit or update existing course and lesson content
* View course list in CRUD dashboard
* All inputs validated before submission

###  Lesson Player

* Dynamic video rendering from admin-provided links
* Toggleable sidebar with lesson list
* Supports back navigation and structured access

### Auth & Security

* JWT token-based session handling (stored in localStorage)
* Password hashing with Bcrypt
* Protected routes on both frontend and backend
* Frontend guards to prevent unauthorized purchases or access

---

## 🧑‍💻 Installation & Running Locally

Make sure you have **Node.js** and **MongoDB Atlas** connection string ready.

### 1. Clone the repository

```bash
git clone https://github.com/Shreyas-goud/EdTechBook
cd EdTechBook
```

---

### 2. Setup Backend

```bash
cd backend
npm install
```

**Environment Variables (`.env`):**

Create a `.env` file in `backend/` with:

```env
MONGO_URL=your_mongodb_atlas_url
JWT_SECRET=your_secret_key
```

Then run:

```bash
npm start
```

---

### 3. Setup Frontend (User)

```bash
cd ../frontend
npm install
npm start
```

---

### 4. Setup Admin Frontend

```bash
cd ../adminfrontend
npm install
npm start
```

---

##  API Routes Overview

###  Auth

* `POST /api/v1/user/signup`
* `POST /api/v1/user/signin`
* `POST /api/v1/admin/signup`
* `POST /api/v1/admin/signin`

###  Courses

* `GET /api/v1/course/preview` – Public
* `GET /api/v1/user/purchasedCourses` – Auth
* `POST /api/v1/user/purchase/:courseId` – Auth

### Admin CRUD

* `POST /api/v1/admin/course` – Create course
* `PUT /api/v1/admin/course/:courseId` – Update course
* `GET /api/v1/admin/course` – View all courses

---

##  Improvements & Known Limitations

* ❌ No payment gateway integration yet (purchases are mocked)
* ❌ No OTP / password reset for users
* 🔐 JWT stored in localStorage (can be enhanced with refresh tokens + HttpOnly cookies)
* ⚠ No role-based access control (RBAC) yet — could be added for fine-grained permissions

---

## Future Enhancements

* ✅ Add file upload for course thumbnails (currently using URLs)
* ✅ Add admin analytics dashboard
* ✅ Add responsive mobile support
* ✅ Add video upload support
* ✅ Add global state management (like Redux or Context API)
* ✅ Convert to TypeScript for better developer experience

---

##  Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you'd like to change or improve.

---

## Author

* **Shreyas Goud**
* [GitHub: @Shreyas-goud](https://github.com/Shreyas-goud)



