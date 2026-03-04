# Kobo to JSON Export Script

This script extracts reading progress from your Kobo e-reader database and exports it to JSON format with book covers and Goodreads links.

## Features

- ✅ Extracts currently reading books with progress percentage
- ✅ Extracts recently finished books
- ✅ **Filters out web articles** (Instapaper, Pocket) - only includes actual book files
- ✅ Fetches book cover images
- ✅ **NEW:** Fetches Goodreads URLs for each book
- ✅ **NEW:** Verifies cover image URLs are accessible before adding them
- ✅ Includes ISBN and multiple cover URL sources (Open Library, Google Books)

## Usage

### Basic Usage
```bash
python3 src/kobo_to_json.py /path/to/KoboReader.sqlite content/books/reading-progress.json
```

### With Image Verification
```bash
python3 src/kobo_to_json.py /path/to/KoboReader.sqlite content/books/reading-progress.json --verify-images
```

### With Goodreads URL Fetching and Image Verification
```bash
python3 src/kobo_to_json.py /path/to/KoboReader.sqlite content/books/reading-progress.json --fetch-goodreads --verify-images
```

### With Cover Extraction (Recommended)
```bash
python3 src/kobo_to_json.py /path/to/KoboReader.sqlite content/reading-progress.json \
  --kobo-root /path/to/kobo/device \
  --copy-covers static/assets/book-covers
```

### Filter by Collection/Shelf
```bash
python3 src/kobo_to_json.py /path/to/KoboReader.sqlite content/reading-progress.json \
  --kobo-root /path/to/kobo/device \
  --copy-covers static/assets/book-covers \
  --collection "Career"
```

## Options

| Option | Description |
|--------|-------------|
| `--kobo-root PATH` | Root directory of Kobo device (for finding cover images) |
| `--copy-covers PATH` | Directory to copy extracted cover images to |
| `--collection NAME` | Only include books from this collection/shelf (e.g., "Career") |
| `--fetch-goodreads` | Fetch Goodreads URLs for books (requires internet, slower) |
| `--verify-images` | Verify cover image URLs are accessible (requires internet, slower) |

## How Goodreads Fetching Works

When `--fetch-goodreads` is enabled, the script will:

1. Search for each book on Goodreads using ISBN (if available) or title + author
2. Parse the search results to find the book's Goodreads page
3. Add the `goodreads_url` field to each book in the JSON output
4. Display progress and success rate in the console

**Note:** This feature is slower because it makes web requests to Goodreads. It includes a 0.5-second delay between requests to be respectful to Goodreads' servers.

## How Image Verification Works

When `--verify-images` is enabled, the script uses an intelligent multi-step process to find the best cover:

### Smart Cover Discovery Process:

1. **ISBN Format Conversion**: Automatically converts between ISBN-10 and ISBN-13 formats
2. **Open Library API Query**: Queries the API to get official book data and cover information
3. **Quality Checking** (downloads and inspects each image):
   - Verifies the image is accessible (HTTP 200 response)
   - Checks the image is a valid image type
   - Rejects images smaller than 5KB (likely blank placeholders)
   - **Downloads and checks actual dimensions** using PIL (Pillow)
   - Rejects images smaller than 100x100 pixels
   - Rejects images with bad aspect ratios (not book-shaped)
4. **Multiple Size Fallbacks**: If API fails, tries direct URLs with Large then Medium sizes
5. **Best Match Selection**: Returns the first high-quality, properly-sized cover found

### Example Output:
```
Finding best cover for: The Pragmatic Programmer
  Found quality cover via Open Library API (ISBN: 9780135957059)

Finding best cover for: Mastering Emacs
  API cover rejected (too small or bad dimensions)
  Found cover via direct URL (ISBN: 9780135957059, size: L)

Finding best cover for: Old Book
  API cover rejected (too small or bad dimensions)
  All attempts failed - no valid cover found
  Warning: No quality cover found for Old Book
```

**Benefits:**
- Finds covers even when the exact ISBN format isn't available
- Filters out blank/placeholder images automatically
- **Verifies actual image dimensions** to ensure displayability
- Rejects 1x1 pixel placeholders and tiny thumbnails
- Uses API data to find the official cover when available
- Falls back gracefully to direct URLs if API fails

**Requirements:**
- Requires Python `Pillow` (PIL) library for dimension checking: `pip install Pillow`
- If Pillow is not installed, falls back to file size checking only

**Note:** This feature is slower because it downloads and inspects each image to verify quality, but it ensures only high-quality, displayable covers are included.

## Output Format

The generated JSON file contains:

```json
{
  "currently_reading": [
    {
      "id": "...",
      "title": "Book Title",
      "author": "Author Name",
      "progress_percent": 50,
      "isbn": "9781234567890",
      "goodreads_url": "https://www.goodreads.com/book/show/12345-book-title",
      "cover_urls": {
        "open_library": "https://covers.openlibrary.org/b/isbn/...",
        "google_books": "https://books.google.com/books/content?..."
      }
    }
  ],
  "recently_finished": [
    {
      "title": "Finished Book",
      "author": "Author Name",
      "finished_date": "2025-11-06T12:00:00Z",
      "goodreads_url": "https://www.goodreads.com/book/show/67890-finished-book"
    }
  ],
  "last_updated": "2025-11-06T14:00:00.000000"
}
```

## Integration with Gatsby Site

The generated JSON file is automatically read by Gatsby through the `gatsby-transformer-json` plugin.

### Cover Image Priority

The site displays covers in this priority order:
1. **Local extracted cover** (from `static/assets/book-covers/`) - optimized by Gatsby
2. **cover_image_url** (Open Library fallback)
3. Placeholder with book title/author

### How It Works

1. **Extract covers**: Run the script with `--copy-covers static/assets/book-covers`
2. **Covers are saved** with clean filenames (based on ISBN or sanitized title)
3. **Gatsby processes** images automatically via `gatsby-source-filesystem`
4. **GraphQL provides** optimized images with blur-up placeholders
5. **Site displays** high-quality, locally-hosted covers with fallbacks

## Tips

- Run with `--fetch-goodreads` periodically to update links for new books
- The script is safe to run multiple times - it will overwrite the output file
- If a Goodreads URL cannot be found, the book will still be included without it
- ISBNs improve Goodreads search accuracy significantly
- **The script automatically filters out web articles** (Instapaper, Pocket, etc.) and only exports actual book files (EPUBs, KEPUBs)
- Web articles are identified by having numeric ContentIDs instead of file paths
