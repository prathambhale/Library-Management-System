import sqlite3

connection = sqlite3.connect("library.db")

cursor = connection.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS borrowed_books (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    book_id INTEGER NOT NULL,

    user_id INTEGER NOT NULL,

    borrow_date TEXT NOT NULL,

    due_date TEXT NOT NULL,

    return_date TEXT,

    status TEXT NOT NULL

)
""")

connection.commit()

connection.close()

print("borrowed_books table created successfully!")