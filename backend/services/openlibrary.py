import requests

BASE_URL = "https://openlibrary.org"

SUBJECT_MAPPING = {
    "fiction": "fiction",
    "non-fiction": "nonfiction",
    "science": "popular_science",
    "history": "history",
    "biography": "biography",
    "children": "juvenile_fiction",
    "mystery-and-thriller": "detective_and_mystery_stories",
    "romance": "love_stories"
}

CATEGORY_RULES = {
    "Science": [
        "science",
        "physics",
        "chemistry",
        "biology",
        "astronomy",
        "mathematics",
        "popular science"
    ],

    "History": [
        "history",
        "historical"
    ],

    "Biography": [
        "biography",
        "autobiography"
    ],

    "Children": [
        "children",
        "juvenile",
        "elementary"
    ],

    "Mystery and Thriller": [
        "mystery",
        "detective",
        "crime",
        "thriller"
    ],

    "Romance": [
        "love stories",
        "romance",
        "courtship"
    ],

    "Fiction": [
        "fiction"
    ]
}

def get_book_subjects(work_key):

    url = f"{BASE_URL}{work_key}.json"

    response = requests.get(url)

    if response.status_code != 200:
        return []

    data = response.json()

    return data.get("subjects", [])

def detect_category(subjects, default_category):

    subjects = [s.lower() for s in subjects]

    for category, keywords in CATEGORY_RULES.items():

        for keyword in keywords:

            for subject in subjects:

                if keyword in subject:
                    return category

    return default_category

def get_books_by_subject(subject, limit=10):

    api_subject = SUBJECT_MAPPING.get(subject.lower(), subject.lower())

    url = f"{BASE_URL}/subjects/{api_subject}.json?limit={limit}"

    response = requests.get(url)

    if response.status_code != 200:
        return []

    data = response.json()

    books = []

    for work in data["works"]:

        subjects = get_book_subjects(work["key"])

        print("\nTitle:", work.get("title"))
        print("Subjects:", subjects)
        print("-" * 60)

        detected_category = detect_category(subjects, subject.title())

        books.append({

            "title": work.get("title"),

            "author": work.get("authors", [{}])[0].get("name", "Unknown"),

            "category": detected_category,

            "cover_id": work.get("cover_id"),

            "quantity": 5

        })

    return books