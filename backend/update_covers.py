import sqlite3
import os
import requests

db_path = os.path.join(os.path.dirname(__file__),"database","library.db")

connection = sqlite3.connect(db_path)
connection.row_factory = sqlite3.Row
cursor = connection.cursor()

cursor.execute("""SELECT id, title, author FROM books WHERE cover_id IS NULL""")
books = cursor.fetchall()
print(f"Found {len(books)} books without covers.")

for book in books:
    title = book["title"]
    author = book["author"]
    print(f"Searching: {title}")
    response = requests.get(
        "https://openlibrary.org/search.json",
        params={
            "title": title,
            "author": author,
            "limit": 1
        }
    )
    data = response.json()
    docs = data.get("docs", [])

    if not docs:
        print("No match found.")
        continue

    cover_id = docs[0].get("cover_i")

    if cover_id is None:
        print("No cover found.")
        continue

    cursor.execute("""UPDATE books SET cover_id = ? WHERE id = ?""", (cover_id,book["id"]))
    print(f"✅ Cover updated for {title}")
connection.commit()
connection.close()

print("🎉 All covers updated successfully!")