#!/usr/bin/env python3
"""
Extract reading progress from Kobo database and export to JSON with book covers and Goodreads links

Usage:
    python kobo_to_json.py path/to/KoboReader.sqlite output.json [OPTIONS]

Options:
    --kobo-root PATH          Root directory of Kobo device (for finding covers)
    --copy-covers PATH        Directory to copy cover images to
    --fetch-goodreads         Fetch Goodreads URLs for books (requires internet, slower)
    --verify-images           Use intelligent cover discovery to find best quality covers (requires internet, slower)

Features:
    - Filters out web articles (Instapaper, Pocket) - only exports actual books
    - Smart cover discovery: tries multiple ISBN formats, checks image quality, filters blank covers
    - Open Library API integration for official cover art
    - Goodreads link fetching for each book

Example:
    python kobo_to_json.py /path/to/.kobo/KoboReader.sqlite reading-progress.json --verify-images
    python kobo_to_json.py /path/to/.kobo/KoboReader.sqlite reading-progress.json --fetch-goodreads --verify-images
"""

import sqlite3
import json
import sys
import shutil
import base64
import zipfile
import time
import urllib.parse
import urllib.request
from pathlib import Path
from datetime import datetime
from xml.etree import ElementTree as ET
from io import BytesIO

def verify_image_url(url, timeout=5, check_dimensions=False):
    """
    Verify that an image URL is accessible and returns a valid image

    Args:
        url: Image URL to verify
        timeout: Request timeout in seconds
        check_dimensions: If True, download and check actual image dimensions

    Returns:
        True if image is accessible and meets quality standards, False otherwise
    """
    try:
        req = urllib.request.Request(
            url,
            headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
        )
        with urllib.request.urlopen(req, timeout=timeout) as response:
            # Check if response is successful and content-type is an image
            content_type = response.headers.get('Content-Type', '')
            if response.status != 200 or 'image' not in content_type.lower():
                return False

            # If dimension checking is enabled, verify the image has proper dimensions
            if check_dimensions:
                try:
                    from PIL import Image

                    # Download and check actual image dimensions
                    image_data = response.read()

                    # Check file size first
                    size_kb = len(image_data) / 1024
                    if size_kb < 5:
                        return False

                    # Check image dimensions
                    image = Image.open(BytesIO(image_data))
                    width, height = image.size

                    # Reject images that are too small (likely placeholders)
                    # Most book covers are at least 200x300 pixels
                    if width < 100 or height < 100:
                        return False

                    # Reject images with extreme aspect ratios (likely not book covers)
                    aspect_ratio = width / height
                    if aspect_ratio < 0.4 or aspect_ratio > 1.5:
                        return False

                    return True

                except ImportError:
                    # PIL not available, fall back to file size check
                    content_length = response.headers.get('Content-Length')
                    if content_length:
                        size_kb = int(content_length) / 1024
                        if size_kb < 5:
                            return False
                    return True
                except Exception as e:
                    return False

            return True
    except Exception as e:
        return False

def get_best_cover_url(isbn, title=None, author=None):
    """
    Find the best available book cover using multiple strategies

    Args:
        isbn: Book ISBN (can be ISBN-10 or ISBN-13)
        title: Book title (optional, for fallback searches)
        author: Book author (optional, for fallback searches)

    Returns:
        Tuple of (best_cover_url, alternative_urls_dict) or (None, {})
    """
    if not isbn:
        return None, {}

    # Clean ISBN
    isbn_clean = isbn.replace('-', '').replace(' ', '')

    # Try to get both ISBN-10 and ISBN-13 formats
    isbns_to_try = [isbn_clean]

    # Convert between ISBN-10 and ISBN-13 if possible
    if len(isbn_clean) == 13 and isbn_clean.startswith('978'):
        # Convert ISBN-13 to ISBN-10
        isbn10 = isbn_clean[3:12]
        isbns_to_try.append(isbn10)
    elif len(isbn_clean) == 10:
        # Convert ISBN-10 to ISBN-13
        isbn13 = '978' + isbn_clean
        isbns_to_try.insert(0, isbn13)  # Try ISBN-13 first

    # Try Open Library API to find the best edition
    best_cover = None
    alternative_urls = {}

    for isbn_variant in isbns_to_try:
        try:
            # Query Open Library Books API
            api_url = f"https://openlibrary.org/api/books?bibkeys=ISBN:{isbn_variant}&format=json&jscmd=data"
            req = urllib.request.Request(
                api_url,
                headers={'User-Agent': 'Mozilla/5.0 (Personal Reading Tracker)'}
            )

            with urllib.request.urlopen(req, timeout=10) as response:
                data = json.loads(response.read().decode('utf-8'))

                if f"ISBN:{isbn_variant}" in data:
                    book_data = data[f"ISBN:{isbn_variant}"]

                    # Try to get large cover from API data
                    if 'cover' in book_data and 'large' in book_data['cover']:
                        cover_url = book_data['cover']['large']
                        if verify_image_url(cover_url, check_dimensions=True):
                            best_cover = cover_url
                            print(f"  Found quality cover via Open Library API (ISBN: {isbn_variant})")
                            # Still add Google Books as alternative
                            alternative_urls['google_books'] = f"https://books.google.com/books/content?id=&printsec=frontcover&img=1&zoom=1&isbn={isbn_variant}"
                            return best_cover, alternative_urls
                        else:
                            print(f"  API cover rejected (too small or bad dimensions)")

                    # Also try medium if large failed
                    if 'cover' in book_data and 'medium' in book_data['cover']:
                        cover_url = book_data['cover']['medium']
                        if verify_image_url(cover_url, check_dimensions=True):
                            best_cover = cover_url
                            print(f"  Found quality cover via Open Library API medium (ISBN: {isbn_variant})")
                            alternative_urls['google_books'] = f"https://books.google.com/books/content?id=&printsec=frontcover&img=1&zoom=1&isbn={isbn_variant}"
                            return best_cover, alternative_urls
        except Exception as e:
            pass

    # Fallback: Try direct Open Library cover URLs
    for isbn_variant in isbns_to_try:
        for size in ['L', 'M']:  # Try Large first, then Medium
            cover_url = f"https://covers.openlibrary.org/b/isbn/{isbn_variant}-{size}.jpg"
            if verify_image_url(cover_url, check_dimensions=True):
                print(f"  Found cover via direct URL (ISBN: {isbn_variant}, size: {size})")
                alternative_urls['google_books'] = f"https://books.google.com/books/content?id=&printsec=frontcover&img=1&zoom=1&isbn={isbn_variant}"
                return cover_url, alternative_urls

    print(f"  All attempts failed - no valid cover found")
    # Return Google Books as last resort (unverified)
    google_books_url = f"https://books.google.com/books/content?id=&printsec=frontcover&img=1&zoom=1&isbn={isbn_clean}"
    return None, {'google_books': google_books_url}

def get_goodreads_url(title, author, isbn=None):
    """
    Search for a book on Goodreads and return the URL

    Args:
        title: Book title
        author: Book author
        isbn: ISBN if available (optional)

    Returns:
        Goodreads URL or None if not found
    """
    try:
        # Try ISBN search first if available
        if isbn:
            # Clean ISBN (remove hyphens)
            isbn_clean = isbn.replace('-', '').replace(' ', '')
            search_query = isbn_clean
        else:
            # Search by title and author
            search_query = f"{title} {author}"

        # Encode the search query
        encoded_query = urllib.parse.quote(search_query)
        search_url = f"https://www.goodreads.com/search?q={encoded_query}"

        # Make request with a user agent
        req = urllib.request.Request(
            search_url,
            headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
        )

        # Add a small delay to be respectful
        time.sleep(0.5)

        with urllib.request.urlopen(req, timeout=10) as response:
            html = response.read().decode('utf-8')

            # Look for the first book result link
            # Goodreads book URLs follow the pattern: /book/show/[id]-[title]
            import re
            pattern = r'href="(/book/show/\d+[^"]*)"'
            match = re.search(pattern, html)

            if match:
                book_path = match.group(1)
                # Clean up HTML entities
                book_path = book_path.replace('&amp;', '&')
                return f"https://www.goodreads.com{book_path}"

    except Exception as e:
        print(f"Could not fetch Goodreads URL for '{title}': {e}")

    return None

def get_isbn_from_content_id(content_id):
    """Extract ISBN from ContentID if available"""
    # ContentIDs sometimes contain ISBNs in the format
    # Try to extract any ISBN-like pattern
    import re
    isbn_pattern = r'(\d{10}|\d{13})'
    match = re.search(isbn_pattern, content_id)
    return match.group(1) if match else None

def extract_cover_from_epub(epub_path):
    """Extract cover image from EPUB file"""
    try:
        with zipfile.ZipFile(epub_path, 'r') as epub:
            # Try to find cover image in common locations
            namelist = epub.namelist()
            
            # Look for common cover filenames
            cover_candidates = [
                name for name in namelist 
                if any(x in name.lower() for x in ['cover', 'jacket']) 
                and name.lower().endswith(('.jpg', '.jpeg', '.png'))
            ]
            
            if cover_candidates:
                # Get the first match
                cover_data = epub.read(cover_candidates[0])
                return cover_data
            
            # Try parsing OPF file for cover reference
            opf_files = [name for name in namelist if name.endswith('.opf')]
            if opf_files:
                opf_content = epub.read(opf_files[0]).decode('utf-8')
                # This is simplified - a full implementation would parse the OPF properly
                if 'cover' in opf_content.lower():
                    # Could parse more thoroughly here
                    pass
                    
    except Exception as e:
        print(f"Error extracting cover from {epub_path}: {e}")
    
    return None

def extract_reading_data(db_path, kobo_root=None, copy_covers_to=None, fetch_goodreads=False, verify_images=False):
    """
    Extract currently reading books and progress from Kobo database

    Args:
        db_path: Path to KoboReader.sqlite
        kobo_root: Root directory of Kobo device (for finding cover images)
        copy_covers_to: Directory to copy cover images to (optional)
        fetch_goodreads: Whether to fetch Goodreads URLs (default: False)
        verify_images: Whether to verify cover image URLs are valid (default: False, slower)
    """
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    # If copy_covers_to is specified, create the directory
    if copy_covers_to:
        covers_dir = Path(copy_covers_to)
        covers_dir.mkdir(parents=True, exist_ok=True)
    
    # Query for books with reading progress (excluding Instapaper/web articles)
    query = """
    SELECT DISTINCT
        c.ContentID,
        c.Title,
        c.Attribution as Author,
        c.Publisher,
        c.Description,
        c.DateLastRead,
        c.___PercentRead as PercentRead,
        c.ReadStatus,
        c.___ExpirationStatus as ExpirationStatus,
        c.ImageId,
        c.ISBN
    FROM content c
    WHERE c.ContentType = 6  -- Books only (not chapters)
        AND c.BookTitle IS NULL  -- Main book entry, not chapters
        AND c.___PercentRead > 0  -- Only books that have been started
        AND c.___PercentRead < 100  -- Currently reading (not finished)
        AND c.ContentID LIKE 'file://%'  -- Only local files (excludes web articles with numeric IDs)
    ORDER BY c.DateLastRead DESC
    """
    
    cursor.execute(query)
    books = []
    
    for row in cursor.fetchall():
        book = {
            'id': row['ContentID'],
            'title': row['Title'],
            'author': row['Author'],
            'publisher': row['Publisher'],
            'description': row['Description'],
            'last_read': row['DateLastRead'],
            'progress_percent': row['PercentRead'] if row['PercentRead'] else 0,
            'read_status': row['ReadStatus'],
            'cover_image_id': row['ImageId'],
            'isbn': row['ISBN']
        }
        
        # Try to process cover image if we have paths
        cover_filename = None
        if row['ImageId'] and kobo_root:
            cover_filename = process_cover(
                row['ImageId'], 
                row['ContentID'], 
                kobo_root, 
                copy_covers_to,
                row['Title']
            )
        
        if cover_filename:
            book['cover_image'] = cover_filename
        elif row['ISBN']:
            # Provide Open Library cover URL as fallback
            book['cover_image_url'] = f"https://covers.openlibrary.org/b/isbn/{row['ISBN']}-L.jpg"
        
        # Find the best cover URL using ISBN
        if row['ISBN']:
            if verify_images:
                print(f"  Finding best cover for: {row['Title']}")
                best_cover_url, alternative_urls = get_best_cover_url(
                    row['ISBN'],
                    row['Title'],
                    row['Author']
                )

                if best_cover_url:
                    if 'cover_urls' not in book:
                        book['cover_urls'] = {}
                    book['cover_urls']['open_library'] = best_cover_url
                    if not book.get('cover_image_url'):
                        book['cover_image_url'] = best_cover_url

                    # Add alternative URLs
                    if alternative_urls:
                        book['cover_urls'].update(alternative_urls)
                else:
                    print(f"  Warning: No quality cover found for {row['Title']}")
                    # Still add Google Books as fallback
                    if alternative_urls:
                        if 'cover_urls' not in book:
                            book['cover_urls'] = {}
                        book['cover_urls'].update(alternative_urls)
            else:
                # Without verification, use simple ISBN lookup
                open_library_url = f"https://covers.openlibrary.org/b/isbn/{row['ISBN']}-L.jpg"
                google_books_url = f"https://books.google.com/books/content?id=&printsec=frontcover&img=1&zoom=1&isbn={row['ISBN']}"

                if 'cover_urls' not in book:
                    book['cover_urls'] = {}
                book['cover_urls']['open_library'] = open_library_url
                book['cover_urls']['google_books'] = google_books_url
                if not book.get('cover_image_url'):
                    book['cover_image_url'] = open_library_url

        # Fetch Goodreads URL if enabled
        if fetch_goodreads and row['Title']:
            print(f"Fetching Goodreads URL for: {row['Title']}")
            goodreads_url = get_goodreads_url(
                row['Title'],
                row['Author'] or '',
                row['ISBN']
            )
            if goodreads_url:
                book['goodreads_url'] = goodreads_url
                print(f"  Found: {goodreads_url}")
            else:
                print(f"  Not found")

        books.append(book)
    
    # Query for finished books (last 10, excluding Instapaper/web articles)
    finished_query = """
    SELECT DISTINCT
        c.ContentID,
        c.Title,
        c.Attribution as Author,
        c.DateLastRead,
        c.___PercentRead as PercentRead,
        c.ISBN,
        c.ImageId
    FROM content c
    WHERE c.ContentType = 6
        AND c.BookTitle IS NULL
        AND c.___PercentRead = 100
        AND c.ContentID LIKE 'file://%'  -- Only local files (excludes web articles with numeric IDs)
    ORDER BY c.DateLastRead DESC
    LIMIT 10
    """
    
    cursor.execute(finished_query)
    finished_books = []
    
    for row in cursor.fetchall():
        book = {
            'title': row['Title'],
            'author': row['Author'],
            'finished_date': row['DateLastRead'],
            'isbn': row['ISBN']
        }
        
        # Find the best cover URL for finished books
        if row['ISBN']:
            if verify_images:
                best_cover_url, alternative_urls = get_best_cover_url(
                    row['ISBN'],
                    row['Title'],
                    row['Author']
                )

                if best_cover_url:
                    book['cover_urls'] = {
                        'open_library': best_cover_url
                    }
                    # Add alternative URLs
                    if alternative_urls:
                        book['cover_urls'].update(alternative_urls)
                else:
                    # Still add Google Books as fallback
                    if alternative_urls:
                        book['cover_urls'] = alternative_urls
            else:
                # Without verification, use simple ISBN lookup
                open_library_url = f"https://covers.openlibrary.org/b/isbn/{row['ISBN']}-L.jpg"
                book['cover_urls'] = {
                    'open_library': open_library_url
                }

        # Fetch Goodreads URL if enabled
        if fetch_goodreads and row['Title']:
            print(f"Fetching Goodreads URL for: {row['Title']}")
            goodreads_url = get_goodreads_url(
                row['Title'],
                row['Author'] or '',
                row['ISBN']
            )
            if goodreads_url:
                book['goodreads_url'] = goodreads_url
                print(f"  Found: {goodreads_url}")
            else:
                print(f"  Not found")

        finished_books.append(book)
    
    conn.close()
    
    return {
        'currently_reading': books,
        'recently_finished': finished_books,
        'last_updated': datetime.now().isoformat()
    }

def process_cover(image_id, content_id, kobo_root, copy_to, title):
    """
    Process cover image from Kobo device
    
    Returns: filename if successful, None otherwise
    """
    kobo_path = Path(kobo_root)
    
    # Kobo stores covers in multiple possible locations
    possible_paths = []
    
    if image_id:
        # Try .kobo/images/ directory with ImageId
        images_dir = kobo_path / '.kobo' / 'images'
        if images_dir.exists():
            # ImageId might be a full path or just an identifier
            image_id_clean = image_id.replace('file://', '').split('/')[-1]
            possible_paths.append(images_dir / f"{image_id_clean}.jpg")
            possible_paths.append(images_dir / f"{image_id_clean}.png")
    
    # Try to find EPUB and extract cover from it
    if content_id and 'file://' in content_id:
        epub_path = content_id.replace('file://', '')
        epub_full_path = kobo_path / epub_path.lstrip('/')
        if epub_full_path.exists() and epub_full_path.suffix.lower() in ['.epub', '.kepub']:
            cover_data = extract_cover_from_epub(epub_full_path)
            if cover_data and copy_to:
                # Save extracted cover
                safe_title = "".join(c for c in title if c.isalnum() or c in (' ', '-', '_')).rstrip()
                cover_filename = f"{safe_title[:50]}_cover.jpg"
                cover_path = Path(copy_to) / cover_filename
                with open(cover_path, 'wb') as f:
                    f.write(cover_data)
                return cover_filename
    
    # Try copying from known locations
    for path in possible_paths:
        if path.exists() and copy_to:
            safe_title = "".join(c for c in title if c.isalnum() or c in (' ', '-', '_')).rstrip()
            cover_filename = f"{safe_title[:50]}_cover{path.suffix}"
            dest_path = Path(copy_to) / cover_filename
            shutil.copy(path, dest_path)
            return cover_filename
    
    return None

def main():
    import argparse
    
    parser = argparse.ArgumentParser(
        description='Extract reading progress from Kobo database with optional cover extraction'
    )
    parser.add_argument('database', help='Path to KoboReader.sqlite file')
    parser.add_argument('output', help='Output JSON file path')
    parser.add_argument('--kobo-root', help='Root directory of Kobo device (for finding covers)', default=None)
    parser.add_argument('--copy-covers', help='Directory to copy cover images to', default=None)
    parser.add_argument('--fetch-goodreads', action='store_true', help='Fetch Goodreads URLs for books (slower, requires internet)')
    parser.add_argument('--verify-images', action='store_true', help='Use intelligent cover discovery: tries multiple ISBN formats, checks quality, filters blank covers (slower, requires internet)')
    
    args = parser.parse_args()
    
    if not Path(args.database).exists():
        print(f"Error: Database file not found: {args.database}")
        sys.exit(1)
    
    # If kobo-root not specified, try to infer it from database path
    kobo_root = args.kobo_root
    if not kobo_root:
        db_parent = Path(args.database).parent
        if db_parent.name == '.kobo':
            kobo_root = str(db_parent.parent)
            print(f"Inferred Kobo root directory: {kobo_root}")
    
    try:
        if args.fetch_goodreads:
            print("Goodreads fetching enabled. This will take longer...")

        if args.verify_images:
            print("Image verification enabled. This will take longer...")

        data = extract_reading_data(
            args.database,
            kobo_root,
            args.copy_covers,
            args.fetch_goodreads,
            args.verify_images
        )

        with open(args.output, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        
        print(f"Successfully exported reading data to {args.output}")
        print(f"Currently reading: {len(data['currently_reading'])} books")
        print(f"Recently finished: {len(data['recently_finished'])} books")

        if args.copy_covers:
            covers_found = sum(1 for book in data['currently_reading'] if 'cover_image' in book)
            print(f"Covers extracted: {covers_found}/{len(data['currently_reading'])}")

        if args.fetch_goodreads:
            goodreads_found = sum(1 for book in data['currently_reading'] if 'goodreads_url' in book)
            goodreads_finished = sum(1 for book in data['recently_finished'] if 'goodreads_url' in book)
            print(f"Goodreads URLs found: {goodreads_found}/{len(data['currently_reading'])} (currently reading)")
            print(f"Goodreads URLs found: {goodreads_finished}/{len(data['recently_finished'])} (finished)")

        if args.verify_images:
            images_valid = sum(1 for book in data['currently_reading'] if book.get('cover_urls', {}).get('open_library'))
            images_finished = sum(1 for book in data['recently_finished'] if book.get('cover_urls', {}).get('open_library'))
            print(f"Valid cover images: {images_valid}/{len(data['currently_reading'])} (currently reading)")
            print(f"Valid cover images: {images_finished}/{len(data['recently_finished'])} (finished)")
        
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == '__main__':
    main()
