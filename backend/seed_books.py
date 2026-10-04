import sqlite3
import os
from seed_data import BOOKS_BY_CATEGORY


def seed_database(category):

    db_path = os.path.join(
        os.path.dirname(__file__),
        "database",
        "library.db"
    )

    connection = sqlite3.connect(db_path)
    cursor = connection.cursor()

    books = BOOKS_BY_CATEGORY.get(category, [])

    for book in books:

        cursor.execute(
            """
            SELECT id
            FROM books
            WHERE title = ? AND author = ?
            """,
            (book[0], book[1])
        )

        existing_book = cursor.fetchone()

        if existing_book:
            print(f"Skipped: {book[0]}")
            continue

        cursor.execute(
            """
            INSERT INTO books
            (title, author, category, cover_id, quantity)
            VALUES (?, ?, ?, ?, ?)
            """,
            book
        )

        print(f"Added: {book[0]}")

    connection.commit()
    connection.close()

    print("Seeding completed successfully!")