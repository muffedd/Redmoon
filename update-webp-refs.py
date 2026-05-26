#!/usr/bin/env python3
"""
Update all HTML and JS files to reference WebP images instead of PNG/JPG.
"""
import json
import re
from pathlib import Path

PROJECT_DIR = Path("F:/Projects/Portfolio_Projects/redmoon")
MAP_PATH = PROJECT_DIR / "webp-conversion-map.json"

# Files to scan
TARGET_EXTENSIONS = {'.html', '.js', '.css'}

def main():
    mapping = json.loads(MAP_PATH.read_text(encoding='utf-8'))
    
    # Sort by longest path first to avoid partial replacements
    sorted_items = sorted(mapping.items(), key=lambda x: len(x[0]), reverse=True)
    
    html_files = list(PROJECT_DIR.glob('*.html')) + list(PROJECT_DIR.glob('*.js')) + list(PROJECT_DIR.glob('*.css'))
    
    total_replacements = 0
    
    for file_path in html_files:
        content = file_path.read_text(encoding='utf-8')
        original = content
        
        for old_path, new_path in sorted_items:
            # Replace exact path references
            count = content.count(old_path)
            if count:
                content = content.replace(old_path, new_path)
                total_replacements += count
        
        if content != original:
            file_path.write_text(content, encoding='utf-8')
            print(f"  Updated: {file_path.name} ({len(original) - len(content)} bytes changed)")
    
    print(f"\nTotal path replacements: {total_replacements}")

if __name__ == "__main__":
    main()
