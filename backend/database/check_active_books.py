import sqlite3

connection = sqlite3.connect("library.db")
cursor = connection.cursor()

cursor.execute("""
DELETE FROM borrowed_books
WHERE book_id = 1
""")

connection.commit()

print(f"Deleted {cursor.rowcount} orphan record(s).")

connection.close()