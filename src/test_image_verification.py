#!/usr/bin/env python3
"""
Test the image verification with dimension checking
"""

import sys
sys.path.insert(0, '.')

from kobo_to_json import verify_image_url, get_best_cover_url

# Test URLs
test_cases = [
    {
        'name': 'The Pragmatic Programmer',
        'isbn': '9780135957059',
        'expected': 'Should find a good cover'
    },
    {
        'name': 'Known bad/tiny cover',
        'isbn': '0000000000',
        'expected': 'Should reject or fail'
    }
]

print("Testing image verification with dimension checking...\n")
print("=" * 80)

for test in test_cases:
    print(f"\nTest: {test['name']}")
    print(f"ISBN: {test['isbn']}")
    print(f"Expected: {test['expected']}")
    print("-" * 80)

    result = get_best_cover_url(test['isbn'], test['name'])

    if result:
        print(f"✓ Success! Found cover: {result}")
    else:
        print(f"✗ No valid cover found")

    print("=" * 80)
