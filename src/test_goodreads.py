#!/usr/bin/env python3
"""
Simple test script to demonstrate Goodreads URL fetching
"""

import sys
sys.path.insert(0, '.')

from kobo_to_json import get_goodreads_url

# Test with some popular books
test_books = [
    {
        'title': 'The Pragmatic Programmer',
        'author': 'Andrew Hunt',
        'isbn': '9780135957059'
    },
    {
        'title': 'Mastering Emacs',
        'author': 'Mickey Petersen',
        'isbn': None
    },
    {
        'title': 'The Kubernetes Book',
        'author': 'Nigel Poulton',
        'isbn': None
    }
]

print("Testing Goodreads URL fetching...\n")

for book in test_books:
    print(f"Book: {book['title']}")
    print(f"Author: {book['author']}")
    print(f"ISBN: {book['isbn']}")

    url = get_goodreads_url(book['title'], book['author'], book['isbn'])

    if url:
        print(f"✓ Found: {url}")
    else:
        print("✗ Not found")

    print("-" * 80)
    print()
