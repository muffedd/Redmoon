#!/usr/bin/env python3
"""
Batch convert all MYPROJECT images to optimized WebP.
Also creates a mapping file for HTML reference updates.
"""
import os
import json
from pathlib import Path
from PIL import Image

PROJECT_DIR = Path("F:/Projects/Portfolio_Projects/redmoon")
MYPROJECT_DIR = PROJECT_DIR / "MYPROJECT"

SUPPORTED = {'.png', '.jpg', '.jpeg', '.bmp', '.tiff', '.gif'}

# Settings
MAX_WIDTH = 1600  # Resize very large images
QUALITY = 85      # WebP quality (0-100)

conversion_map = {}  # old_relative_path -> new_relative_path
stats = []

def convert_image(src_path: Path):
    """Convert a single image to WebP."""
    rel = src_path.relative_to(PROJECT_DIR)
    dst_path = src_path.with_suffix('.webp')
    rel_dst = dst_path.relative_to(PROJECT_DIR)

    # Skip if already webp
    if src_path.suffix.lower() == '.webp':
        return

    try:
        with Image.open(src_path) as img:
            # Convert to RGB if necessary (WebP doesn't support all modes)
            if img.mode in ('RGBA', 'P'):
                # Keep transparency for PNGs
                if img.mode == 'P':
                    img = img.convert('RGBA')
            elif img.mode != 'RGB':
                img = img.convert('RGB')

            # Resize if too large
            orig_w, orig_h = img.size
            if orig_w > MAX_WIDTH:
                ratio = MAX_WIDTH / orig_w
                new_h = int(orig_h * ratio)
                img = img.resize((MAX_WIDTH, new_h), Image.LANCZOS)

            # Save as WebP
            if img.mode == 'RGBA':
                img.save(dst_path, 'WEBP', quality=QUALITY, method=6)
            else:
                img.save(dst_path, 'WEBP', quality=QUALITY, method=6)

        orig_size = src_path.stat().st_size
        new_size = dst_path.stat().st_size
        savings = orig_size - new_size
        pct = (savings / orig_size * 100) if orig_size > 0 else 0

        conversion_map[str(rel).replace('\\', '/')] = str(rel_dst).replace('\\', '/')
        stats.append({
            'name': rel.name,
            'orig_kb': round(orig_size / 1024, 1),
            'new_kb': round(new_size / 1024, 1),
            'saved_kb': round(savings / 1024, 1),
            'saved_pct': round(pct, 1),
        })

        print(f"  {rel.name}: {round(orig_size/1024,1)}KB → {round(new_size/1024,1)}KB ({round(pct,1)}% saved)")

    except Exception as e:
        print(f"  ERROR converting {rel}: {e}")


def main():
    print("Scanning MYPROJECT for images...\n")
    image_files = []
    for root, _, files in os.walk(MYPROJECT_DIR):
        for f in files:
            if Path(f).suffix.lower() in SUPPORTED:
                image_files.append(Path(root) / f)

    print(f"Found {len(image_files)} images. Starting conversion...\n")

    for img_path in sorted(image_files):
        convert_image(img_path)

    # Save mapping
    map_path = PROJECT_DIR / "webp-conversion-map.json"
    map_path.write_text(json.dumps(conversion_map, indent=2))

    # Summary
    total_orig = sum(s['orig_kb'] for s in stats)
    total_new = sum(s['new_kb'] for s in stats)
    total_saved = total_orig - total_new

    print(f"\n{'='*60}")
    print(f"CONVERSION COMPLETE")
    print(f"{'='*60}")
    print(f"Images converted: {len(stats)}")
    print(f"Original total:   {round(total_orig,1)} KB")
    print(f"WebP total:       {round(total_new,1)} KB")
    print(f"Space saved:      {round(total_saved,1)} KB ({round(total_saved/total_orig*100,1)}%)")
    print(f"\nMapping saved to: {map_path}")

    # Top 10 savings
    print(f"\nTop 10 savings:")
    for s in sorted(stats, key=lambda x: x['saved_kb'], reverse=True)[:10]:
        print(f"  {s['name']}: {s['saved_kb']}KB saved ({s['saved_pct']}%)")


if __name__ == "__main__":
    main()
