"""Cloudflare Workers entrypoint for the original Flask application."""

from flask import Response, request
from jinja2 import DictLoader
from pyodide.ffi import run_sync
from workers import wsgi
from worker_resources import TEMPLATES

from flask_app import app


app.jinja_loader = DictLoader(TEMPLATES)


def serve_static(filename):
    asset = request.environ["workers.env"].ASSETS
    upstream = run_sync(asset.fetch(f"https://assets.local/{filename}"))
    body = run_sync(upstream.bytes())
    return Response(body, status=upstream.status, headers=upstream.headers)


app.view_functions["static"] = serve_static


Default = wsgi.entrypoint(app)
