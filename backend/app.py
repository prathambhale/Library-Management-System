from flask import Flask, request
from flask_cors import CORS
import sqlite3
import os
from services.openlibrary import get_books_by_subject
from datetime import date
from seed_books import seed_database

app = Flask(__name__)
CORS(app)


def get_db_connection():
    db_path = os.path.join(os.path.dirname(__file__), "database", "library.db")

    print("Database Path:", db_path)

    connection = sqlite3.connect(db_path)
    connection.row_factory = sqlite3.Row

    return connection
@app.route("/")
def home():
    return {
        "Project": "Library Management System",
        "Version": "1.0",
        "Developer": "Pratham"
    }
@app.route("/books")
def get_books():
    connection = get_db_connection()

    cursor = connection.cursor()

    cursor.execute("SELECT * FROM books")

    books = cursor.fetchall()

    connection.close()

    return [dict(book) for book in books]
@app.route("/books/<category>")
def get_books_by_category(category):

    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute(
        "SELECT * FROM books WHERE category = ?",
        (category,)
    )

    books = cursor.fetchall()

    connection.close()

    return [dict(book) for book in books]
@app.route("/books", methods=["POST"])
def add_book():

    data = request.get_json()
    print("Received Data:", data)

    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute("""
    INSERT INTO books
    (title, author, category, quantity)
    VALUES (?, ?, ?, ?)
""", (
    data["title"],
    data["author"],
    data["category"],
    data["quantity"]
))

    connection.commit()
    connection.close()

    return {"message": "Book Added Successfully"}
@app.route("/books/<int:id>", methods=["DELETE"])
def delete_book(id):

    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute("""
    SELECT COUNT(*) AS total
    FROM borrowed_books
    WHERE book_id = ?
    AND return_date IS NULL
    """, (id,))

    active_borrows = cursor.fetchone()["total"]

    if active_borrows > 0:

        connection.close()

        return {
            "success": False,
            "message": "This book is currently borrowed and cannot be deleted."
        }

    cursor.execute(
        "DELETE FROM books WHERE id = ?",
        (id,)
    )

    connection.commit()
    connection.close()

    return {
        "success": True,
        "message": "Book Deleted Successfully"
}
@app.route("/books/<int:id>", methods=["PUT"])
def update_book(id):

    data = request.get_json()

    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute("""
        UPDATE books
        SET
            title = ?,
            author = ?,
            category = ?,
            quantity = ?
        WHERE id = ?
    """, (
        data["title"],
        data["author"],
        data["category"],
        data["quantity"],
        id
    ))

    connection.commit()
    connection.close()

    return {"message": "Book Updated Successfully"}
@app.route("/import-books/<category>")
def import_books(category):

    seed_database(category)

    return {
        "message": f"{category} books imported successfully!"
    }
@app.route("/dashboard-stats")
def dashboard_stats():
    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute("""
        SELECT category, COUNT(*) as total
        FROM books
        GROUP BY category
    """)

    category_rows = cursor.fetchall()

    cursor.execute("""
        SELECT COUNT(*) as total_books
        FROM books
    """)

    total_books = cursor.fetchone()["total_books"]

    cursor.execute("""
    SELECT COUNT(*) AS total_users
    FROM users
""")
    
    total_users = cursor.fetchone()["total_users"]

    cursor.execute("""
    SELECT COUNT(*) AS borrowed_books
    FROM borrowed_books
    WHERE return_date IS NULL
""")
    
    borrowed_books = cursor.fetchone()["borrowed_books"]

    cursor.execute("""
SELECT COUNT(*) AS books_taken
FROM borrowed_books
WHERE return_date IS NULL
""")
    
    books_taken = cursor.fetchone()["books_taken"]

    cursor.execute("""
    SELECT COUNT(*) AS overdue_books
    FROM borrowed_books
    WHERE
        return_date IS NULL
        AND due_date < DATE('now')
""")
    
    overdue_books = cursor.fetchone()["overdue_books"]

    connection.close()

    categories = {}

    for row in category_rows:
        categories[row["category"]] = row["total"]

    return {
    "total_books": total_books,
    "total_users": total_users,
    "borrowed_books": borrowed_books,
    "books_taken": books_taken,
    "overdue_books": overdue_books,
    "categories": categories
}
@app.route("/borrowed-books")
def get_borrowed_books():

    connection = get_db_connection()

    cursor = connection.cursor()

    cursor.execute("""
    SELECT

        bb.id,
        u.name AS student,
        b.title AS book,
        bb.borrow_date,
        bb.due_date,
        bb.return_date,

        CASE
    WHEN bb.return_date IS NOT NULL THEN 'Returned'
    WHEN DATE(bb.due_date) < DATE('now') THEN 'Overdue'
    WHEN DATE(bb.due_date) <= DATE('now', '+3 days') THEN 'Due Soon'
    ELSE 'Borrowed'
END AS status

    FROM borrowed_books bb

    INNER JOIN books b
    ON bb.book_id = b.id

    INNER JOIN users u
    ON bb.user_id = u.id

    WHERE bb.return_date IS NULL
    """)

    borrowed_books = cursor.fetchall()

    print("Borrowed books:", [dict(book) for book in borrowed_books])

    connection.close()
    
    return [dict(book) for book in borrowed_books] 
@app.route("/student-books/<int:user_id>")
def get_student_books(user_id):

    connection = get_db_connection()

    cursor = connection.cursor()

    cursor.execute("""
    SELECT

        bb.id,
        b.title,
        b.author,
        b.category,
        bb.borrow_date,
        bb.due_date,
        bb.return_date,

        CASE
            WHEN DATE(bb.due_date) < DATE('now') THEN 'Overdue'
            WHEN DATE(bb.due_date) <= DATE('now', '+3 days') THEN 'Due Soon'
            ELSE 'Borrowed'
        END AS status
    
    FROM borrowed_books bb

    INNER JOIN books b
    ON bb.book_id = b.id

    WHERE
        bb.user_id = ?
        AND bb.return_date IS NULL
    """, (user_id,))

    books = cursor.fetchall()

    connection.close()

    return [dict(book) for book in books]
@app.route("/student-history/<int:user_id>")
def get_student_history(user_id):

        connection = get_db_connection()
        
        cursor = connection.cursor()
        
        cursor.execute("""
             SELECT
            bb.id,
            b.title,
            b.author,
            b.category,
            bb.borrow_date,
            bb.due_date,
            bb.return_date,

            CASE
                WHEN bb.return_date IS NOT NULL THEN 'Returned'
                WHEN DATE(bb.due_date) < DATE('now') THEN 'Overdue'
                WHEN DATE(bb.due_date) <= DATE('now', '+3 days') THEN 'Due Soon'
                ELSE 'Borrowed'
            END AS status

        FROM borrowed_books bb

        INNER JOIN books b
        ON bb.book_id = b.id

        WHERE bb.user_id = ?

        ORDER BY bb.borrow_date DESC

    """, (user_id,))
        
        history = cursor.fetchall()
        
        connection.close()
        
        return [dict(record) for record in history]
@app.route("/borrow-book", methods=["POST"])
def borrow_book():

    data = request.get_json()

    today = date.today().isoformat()

    if data["due_date"] < today:
        return {
            "success": False,
            "message": "Due date cannot be in the past."
        }, 400

    print("Borrow Request:", data)
    print("User ID:", data["user_id"])

    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute("""
        SELECT COUNT(*) AS total
        FROM borrowed_books
        WHERE user_id = ?
        AND return_date IS NULL
    """, (
        data["user_id"],
    ))

    borrow_count = cursor.fetchone()["total"]

    if borrow_count >= 3:
        connection.close()
        return {
            "success": False,
            "message": "You can only borrow 3 books."
        }

    cursor.execute("""
        SELECT COUNT(*) AS total
        FROM borrowed_books
        WHERE
            user_id = ?
            AND book_id = ?
            AND return_date IS NULL
    """, (
        data["user_id"],
        data["book_id"]
    ))

    already_borrowed = cursor.fetchone()["total"]

    if already_borrowed > 0:
        connection.close()
        return {
            "success": False,
            "message": "You have already borrowed this book."
        }

    cursor.execute("""
        SELECT quantity
        FROM books
        WHERE id = ?
    """, (
        data["book_id"],
    ))

    book = cursor.fetchone()

    if book["quantity"] <= 0:
        connection.close()
        return {
            "success": False,
            "message": "Book is currently not available."
        }

    cursor.execute("""
        INSERT INTO borrowed_books
        (book_id, user_id, borrow_date, due_date, return_date, status)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (
        data["book_id"],
        data["user_id"],
        data["borrow_date"],
        data["due_date"],
        None,
        "Borrowed"
    ))

    cursor.execute("""
        UPDATE books
        SET quantity = quantity - 1
        WHERE id = ?
    """, (
        data["book_id"],
    ))

    connection.commit()
    connection.close()

    return {
        "success": True,
        "message": "Book borrowed successfully."
    }
@app.route("/return-book/<int:borrow_id>", methods=["PUT"])
def return_book(borrow_id):

    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute("""
    SELECT book_id, status
    FROM borrowed_books
    WHERE id = ?
    """, (borrow_id,))

    borrow = cursor.fetchone()

    if borrow is None:
        connection.close()
        return {
            "success": False,
            "message": "Borrow record not found."
        }

    if borrow["status"] == "Returned":
        connection.close()
        return {
            "success": False,
            "message": "Book is already returned."
        }

    cursor.execute("""
    UPDATE borrowed_books
    SET
        status = ?,
        return_date = DATE('now')
    WHERE id = ?
    """, (
        "Returned",
        borrow_id
    ))

    cursor.execute("""
    UPDATE books
    SET quantity = quantity + 1
    WHERE id = ?
    """, (
        borrow["book_id"],
    ))

    connection.commit()
    connection.close()

    return {
        "success": True,
        "message": "Book returned successfully."
    }
@app.route("/login", methods=["POST"])
def login():

    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute("""
        SELECT *
        FROM users
        WHERE email = ?
    """, (email,))

    user = cursor.fetchone()

    connection.close()

    if user is None:
        return {
            "success": False,
            "message": "User not found."
        }

    if user["password"] != password:
        return {
            "success": False,
            "message": "Incorrect password."
        }

    return {
        "success": True,
        "message": "Login successful.",
        "user": {
            "id": user["id"],
            "name": user["name"],
            "email": user["email"],
            "role": user["role"]
        }
    }
@app.route("/register", methods=["POST"])
def register():

    data = request.get_json()

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute(
        "SELECT * FROM users WHERE email = ?",
        (email,)
    )

    existing_user = cursor.fetchone()

    if existing_user:
        connection.close()
        return {
            "success": False,
            "message": "Email already exists."
        }

    cursor.execute("""
        INSERT INTO users
        (name, email, password, role)
        VALUES (?, ?, ?, ?)
    """, (
        name,
        email,
        password,
        "student"
    ))

    connection.commit()
    connection.close()

    return {
        "success": True,
        "message": "Account created successfully."
    }
@app.route("/reset-category/<category>")
def reset_category(category):

    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute(
        "DELETE FROM books WHERE category = ?",
        (category,)
    )

    connection.commit()
    connection.close()

    return {
        "message": f"{category} books deleted successfully."
    }

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)