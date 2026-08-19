#!/usr/bin/env python3
"""
Local preview server that behaves like Cloudflare Pages.

python -m http.server serves files literally, so a link to /uslugi returns 404
because there is no file with that exact name. Cloudflare Pages resolves it to
uslugi.html. This server does the same, so what you see locally matches what
goes live.

    python serve.py           # http://127.0.0.1:8000
    python serve.py 8080      # a different port

Extras over the stock server:
  * /uslugi          -> uslugi.html
  * /uslugi/         -> uslugi.html
  * missing page     -> 404.html, if the site has one
  * no caching, so a plain refresh always shows the current file
  * binds to 127.0.0.1 only, so nothing leaks to the local network
"""

import sys
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parent / "site"


class PagesHandler(SimpleHTTPRequestHandler):
    def translate_path(self, path):
        wynik = Path(super().translate_path(path))

        # /uslugi -> /uslugi.html (only when the bare name does not exist)
        if not wynik.exists() and not wynik.suffix:
            kandydat = wynik.with_suffix(".html")
            if kandydat.is_file():
                return str(kandydat)

        # /uslugi/ -> /uslugi.html
        if wynik.is_dir() and not (wynik / "index.html").is_file():
            kandydat = wynik.with_suffix(".html")
            if kandydat.is_file():
                return str(kandydat)

        return str(wynik)

    def send_error(self, code, message=None, explain=None):
        strona = ROOT / "404.html"
        if code == 404 and strona.is_file():
            tresc = strona.read_bytes()
            self.send_response(404)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(tresc)))
            self.end_headers()
            if self.command != "HEAD":
                self.wfile.write(tresc)
            return
        super().send_error(code, message, explain)

    def end_headers(self):
        # Without this the browser caches aggressively and a refresh can show
        # a stale file — which makes it easy to misread a test result.
        self.send_header("Cache-Control", "no-store, must-revalidate")
        super().end_headers()

    def log_message(self, fmt, *args):
        sys.stderr.write("  %s\n" % (fmt % args))


def main():
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000

    if not ROOT.is_dir():
        sys.exit(f"Nie znaleziono katalogu: {ROOT}")

    handler = partial(PagesHandler, directory=str(ROOT))
    with ThreadingHTTPServer(("127.0.0.1", port), handler) as srv:
        print(f"Serwuje {ROOT}")
        print(f"  http://127.0.0.1:{port}/")
        print("  Ctrl+C konczy\n")
        try:
            srv.serve_forever()
        except KeyboardInterrupt:
            print("\nZatrzymano.")


if __name__ == "__main__":
    main()
