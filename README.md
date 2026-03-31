# RACS Auto Deal Dashboard

This project is a React (Vite) frontend application with a Node.js (Express) backend. It uses **Prisma ORM** connecting to a **MySQL Database**.

## Getting Started on a New Computer

If you clone or move this project to a brand-new computer, follow these exact steps to get the database and servers running again:

### 1. Prerequisites
You must install these programs on the new computer before you begin:
* **Node.js** (v18 or higher)
* **MySQL Server** (You can use standalone MySQL Installer, or XAMPP)

### 2. Setup Database Structure
1. Open your MySQL client (like MySQL Workbench, or phpMyAdmin if you use XAMPP).
2. Create a new, completely empty database and name it `racs_auto_deal`.

### 3. Setup Project Files
1. Open the project folder in VS Code or your Terminal.
2. In the `server` folder, create a file named `.env` if it does not already exist.
3. Add the following line to the `.env` file to connect to your local MySQL database:
   ```env
   DATABASE_URL="mysql://root:@127.0.0.1:3306/racs_auto_deal"
   ```
   *(No `)*

### 4. Install Dependencies & Build Database
Open two terminal windows (one for the `server` folder, one for the main project folder).

In the **`server`** folder terminal, run these commands in order:
```bash
# 1. Install all backend packages
npm install

# 2. Tell Prisma to build the tables in your empty database
npx prisma db push

# 3. Create the initial 'admin' / 'admin123' Super Admin account
npm run prisma:generate
npx ts-node prisma/seed.ts
```

In the **Main root folder** terminal, run:
```bash
# Install all frontend packages
npm install
```

### 5. Start Servers
Finally, to start the application, run the developer mode commands:

**Terminal 1 (`/server`):**
```bash
npm run dev
```

**Terminal 2 (`/` root):**
```bash
npm run dev
```

The app will become available at `http://localhost:5173`. You can log back into `/login` using the generated `admin` and `admin123` credentials.
