import sqlite3
import os

db_path = os.path.join(os.path.dirname(__file__), "library.db")

connection = sqlite3.connect(db_path)

cursor = connection.cursor()

cursor.execute("DROP TABLE IF EXISTS books")
cursor.execute("DROP TABLE IF EXISTS users")

cursor.execute("""
CREATE TABLE books (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    title TEXT NOT NULL,

    author TEXT NOT NULL,

    category TEXT NOT NULL,

    cover_id INTEGER,

    quantity INTEGER DEFAULT 5

)
""")

connection.commit()

cursor.execute("""
CREATE TABLE users (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    name TEXT NOT NULL,

    email TEXT NOT NULL UNIQUE,

    password TEXT NOT NULL,

    role TEXT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

)
""")

connection.commit()
cursor.execute("""
INSERT INTO users (name, email, password, role)
VALUES (?, ?, ?, ?)
""", (
    "Admin",
    "admin@gmail.com",
    "admin123",
    "admin"
))

connection.commit()

connection.close()

print("Database recreated successfully!")