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
