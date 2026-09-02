#!/usr/bin/env python3
"""Fail the build on internal links that point at nothing.

Walks the generated site, collects every same-origin href/src, and resolves it
against `public/`. External links are out of scope: they rot for reasons a CI
run cannot fix, and checking them makes the build depend on the whole internet.
"""

import os
import re
import sys
from html.parser import HTMLParser
from urllib.parse import unquote, urldefrag, urljoin, urlparse

PUBLIC = sys.argv[1] if len(sys.argv) > 1 else "public"
BASE_URL = os.environ.get("BASE_URL", "https://brittcrawford.com/")

ATTRS = {"a": "href", "link": "href", "img": "src", "script": "src",
         "source": "src", "iframe": "src", "video": "src", "audio": "src"}


class Links(HTMLParser):
    def __init__(self):
        super().__init__()
        self.found = []

    def handle_starttag(self, tag, attrs):
        name = ATTRS.get(tag)
        if not name:
            return
        for k, v in attrs:
            if k == name and v:
                self.found.append(v)


def target_exists(path):
    """Resolve a site-absolute path the way a static host would."""
    rel = unquote(path).lstrip("/")
    candidate = os.path.join(PUBLIC, rel)
    if os.path.isfile(candidate):
        return True
    if os.path.isfile(os.path.join(candidate, "index.html")):
        return True
    return False


def main():
    if not os.path.isdir(PUBLIC):
        sys.exit(f"no such directory: {PUBLIC} — run hugo first")

    base_host = urlparse(BASE_URL).netloc
    broken = []
    pages = 0

    for root, _, files in os.walk(PUBLIC):
        for f in files:
            if not f.endswith(".html"):
                continue
            pages += 1
            src = os.path.join(root, f)
            page_url = "/" + os.path.relpath(src, PUBLIC).replace(os.sep, "/")
            parser = Links()
            with open(src, encoding="utf-8", errors="replace") as fh:
                parser.feed(fh.read())
            for raw in parser.found:
                href, _ = urldefrag(raw.strip())
                if not href:
                    continue
                parsed = urlparse(href)
                if parsed.scheme in ("mailto", "tel", "data", "javascript"):
                    continue
                if parsed.scheme and parsed.netloc and parsed.netloc != base_host:
                    continue  # external
                path = parsed.path or "/"
                if not path.startswith("/"):
                    path = urljoin(page_url, path)
                if not target_exists(path):
                    broken.append((page_url, raw))

    print(f"checked {pages} pages in {PUBLIC}/")
    if broken:
        print(f"\n{len(broken)} broken internal link(s):\n")
        for page, link in sorted(set(broken)):
            print(f"  {page}  ->  {link}")
        sys.exit(1)
    print("no broken internal links")


if __name__ == "__main__":
    main()
