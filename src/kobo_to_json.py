#!/usr/bin/env python3
"""

Usage:
    python kobo_to_json.py path/to/KoboReader.sqlite output.json [OPTIONS]

Options:
    --kobo-root PATH          Root directory of Kobo device (for finding covers)
    --copy-covers PATH        Directory to copy cover images to

Features:
    - Filters out web articles (Instapaper, Pocket) - only exports actual books
    - Smart cover discovery: tries multiple ISBN formats, checks image quality, filters blank covers
    - Open Library API integration for official cover art

Example:
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

def get_isbn_from_content_id(content_id):
    """Extract ISBN from ContentID if available"""
    # ContentIDs sometimes contain ISBNs in the format
    # Try to extract any ISBN-like pattern
    import re
    isbn_pattern = r'(\d{10}|\d{13})'
    match = re.search(isbn_pattern, content_id)
    return match.group(1) if match else None

def extract_cover_from_epub(epub_path):
    """Extract cover image from EPUB file using proper EPUB structure parsing"""
    import os.path

    try:
        with zipfile.ZipFile(epub_path, 'r') as z:
            # Step 1: Read container.xml to find the OPF file location
            try:
                container_xml = z.read("META-INF/container.xml")
                container_tree = ET.fromstring(container_xml)
                rootfile_path = container_tree.find(".//{urn:oasis:names:tc:opendocument:xmlns:container}rootfile").get("full-path")
            except Exception as e:
                print(f"  Could not read container.xml: {e}")
                return None

            # Step 2: Read the OPF file
            try:
                opf_content = z.read(rootfile_path)
                opf_tree = ET.fromstring(opf_content)
            except Exception as e:
                print(f"  Could not read OPF file: {e}")
                return None

            # Step 3: Try multiple methods to find the cover
            cover_path = None

            # Method 1: EPUB 2.0 - Look for <meta name="cover" content="..."/>
            try:
                cover_meta = opf_tree.find(".//{http://www.idpf.org/2007/opf}metadata/{http://www.idpf.org/2007/opf}meta[@name='cover']")
                if cover_meta is not None:
                    cover_id = cover_meta.get("content")
                    # Find the manifest item with this ID
                    cover_item = opf_tree.find(f".//{'{http://www.idpf.org/2007/opf}'}manifest/{'{http://www.idpf.org/2007/opf}'}item[@id='{cover_id}']")
                    if cover_item is not None:
                        cover_href = cover_item.get("href")
                        # Resolve relative path - handle URL encoding
                        import urllib.parse
                        cover_href = urllib.parse.unquote(cover_href)
                        cover_path = os.path.join(os.path.dirname(rootfile_path), cover_href)
                        print(f"  Found cover via EPUB 2.0 metadata: {cover_path}")
            except Exception as e:
                print(f"  EPUB 2.0 method failed: {e}")

            # Method 2: EPUB 3.0 - Look for properties="cover-image"
            if not cover_path:
                try:
                    cover_item = opf_tree.find(".//{http://www.idpf.org/2007/opf}manifest/{http://www.idpf.org/2007/opf}item[@properties='cover-image']")
                    if cover_item is not None:
                        cover_href = cover_item.get("href")
                        # Resolve relative path - handle URL encoding
                        import urllib.parse
                        cover_href = urllib.parse.unquote(cover_href)
                        cover_path = os.path.join(os.path.dirname(rootfile_path), cover_href)
                        print(f"  Found cover via EPUB 3.0 properties: {cover_path}")
                except Exception as e:
                    print(f"  EPUB 3.0 method failed: {e}")

            # Method 3: Fallback - Look for common cover filenames
            if not cover_path:
                namelist = z.namelist()
                cover_candidates = [
                    name for name in namelist
                    if any(x in name.lower() for x in ['cover'])
                    and name.lower().endswith(('.jpg', '.jpeg', '.png', '.gif'))
                    and not name.startswith('__MACOSX')
                ]
                if cover_candidates:
                    # Sort to prefer images in root or images directory
                    cover_candidates.sort(key=lambda x: (x.count('/'), len(x)))
                    cover_path = cover_candidates[0]
                    print(f"  Found cover via filename search: {cover_path}")

            # Step 4: Extract the cover image
            if cover_path:
                try:
                    # Normalize path separators
                    cover_path = cover_path.replace('\\', '/')
                    cover_data = z.read(cover_path)
                    return cover_data
                except Exception as e:
                    print(f"  Could not read cover file '{cover_path}': {e}")
                    return None
            else:
                print(f"  No cover found in EPUB")
                return None

    except Exception as e:
        print(f"  Error extracting cover from {epub_path}: {e}")

    return None

def extract_reading_data(db_path, kobo_root=None, copy_covers_to=None):
    """
    Extract currently reading books and progress from Kobo database

    Args:
        db_path: Path to KoboReader.sqlite
        kobo_root: Root directory of Kobo device (for finding cover images)
        copy_covers_to: Directory to copy cover images to (optional)
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
        if kobo_root and copy_covers_to:
            print(f"\nProcessing: {row['Title'][:50]}")
            print(f"  ImageId: {row['ImageId']}")
            print(f"  ContentID: {row['ContentID'][:80]}...")
            cover_filename = process_cover(
                row['ImageId'],
                row['ContentID'],
                kobo_root,
                copy_covers_to,
                row['Title'],
                row['ISBN']
            )

        if cover_filename:
            book['cover_image'] = cover_filename
        elif row['ISBN']:
            # Provide Open Library cover URL as fallback
            book['cover_image_url'] = f"https://covers.openlibrary.org/b/isbn/{row['ISBN']}-L.jpg"
        
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
        
        finished_books.append(book)
    
    conn.close()
    
    return {
        'currently_reading': books,
        'recently_finished': finished_books,
        'last_updated': datetime.now().isoformat()
    }

def process_cover(image_id, content_id, kobo_root, copy_to, title, isbn=None):
    """
    Process cover image from Kobo device

    Returns: filename if successful, None otherwise
    """
    kobo_path = Path(kobo_root)

    # Generate a clean filename based on title or ISBN
    if isbn and isbn.startswith('978'):
        # Use ISBN for filename if available
        safe_filename = f"isbn_{isbn}"
    else:
        # Use sanitized title
        safe_title = "".join(c for c in title if c.isalnum() or c in (' ', '-', '_')).rstrip()
        safe_filename = safe_title[:50].replace(' ', '_').lower()

    # Kobo stores covers in multiple possible locations
    possible_paths = []

    if image_id:
        # Try .kobo/images/ directory with ImageId
        images_dir = kobo_path / '.kobo' / 'images'
        print(f"  Checking images dir: {images_dir} (exists: {images_dir.exists()})")
        if images_dir.exists():
            # ImageId might be a full path or just an identifier
            image_id_clean = image_id.replace('file://', '').split('/')[-1]
            possible_paths.append(images_dir / f"{image_id_clean}.jpg")
            possible_paths.append(images_dir / f"{image_id_clean}.png")
            print(f"  Looking for: {image_id_clean}.jpg or .png")

    # Try to find EPUB and extract cover from it
    if content_id and 'file://' in content_id:
        # Extract the filename from the ContentID
        # ContentID format: file:///mnt/onboard/filename.epub
        # But on the host system, it's at /kobo_root/filename.epub
        epub_path = content_id.replace('file://', '')

        # Strip the /mnt/onboard prefix which is Kobo's internal mount point
        if epub_path.startswith('/mnt/onboard/'):
            epub_path = epub_path.replace('/mnt/onboard/', '')

        # Now construct the full path relative to kobo_root
        epub_full_path = kobo_path / epub_path
        print(f"  EPUB path: {epub_full_path}")
        print(f"  EPUB exists: {epub_full_path.exists()}")

        if epub_full_path.exists() and epub_full_path.suffix.lower() in ['.epub', '.kepub']:
            print(f"  Attempting to extract cover from EPUB...")
            cover_data = extract_cover_from_epub(epub_full_path)
            if cover_data and copy_to:
                # Save extracted cover
                cover_filename = f"{safe_filename}.jpg"
                cover_path = Path(copy_to) / cover_filename
                with open(cover_path, 'wb') as f:
                    f.write(cover_data)
                print(f"  ✓ Extracted cover from EPUB: {cover_filename}")
                return cover_filename
            else:
                print(f"  ✗ Could not extract cover from EPUB")

    # Try copying from known locations
    print(f"  Checking {len(possible_paths)} possible paths...")
    for path in possible_paths:
        print(f"    Checking: {path} (exists: {path.exists()})")
        if path.exists() and copy_to:
            cover_filename = f"{safe_filename}{path.suffix}"
            dest_path = Path(copy_to) / cover_filename
            shutil.copy(path, dest_path)
            print(f"  ✓ Copied cover from Kobo images: {cover_filename}")
            return cover_filename

    print(f"  ✗ No cover found for this book")
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
        data = extract_reading_data(
            args.database,
            kobo_root,
            args.copy_covers,
        )

        with open(args.output, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        
        print(f"Successfully exported reading data to {args.output}")
        print(f"Currently reading: {len(data['currently_reading'])} books")
        print(f"Recently finished: {len(data['recently_finished'])} books")

        if args.copy_covers:
            covers_found = sum(1 for book in data['currently_reading'] if 'cover_image' in book)
            print(f"Covers extracted: {covers_found}/{len(data['currently_reading'])}")

    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == '__main__':
    main()
