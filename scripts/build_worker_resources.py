"""Bundle the original CSV and templates as Python imports for Workers."""

import base64
import gzip
from pathlib import Path
import shutil


root = Path(__file__).resolve().parents[1]
csv_bytes = (root / "Data" / "anime.csv").read_bytes()
encoded = base64.b64encode(gzip.compress(csv_bytes, compresslevel=9)).decode("ascii")
templates = {path.name: path.read_text(encoding="utf-8")
             for path in sorted((root / "templates").glob("*.html"))}

bundle = root / "worker_src"
(bundle / "ProductionCode").mkdir(parents=True, exist_ok=True)
for name in ("worker.py", "flask_app.py"):
    shutil.copy2(root / name, bundle / name)
for name in ("__init__.py", "datasource.py", "services.py"):
    source = root / "ProductionCode" / name
    if source.exists():
        shutil.copy2(source, bundle / "ProductionCode" / name)

output = bundle / "worker_resources.py"
output.write_text(
    '"""Generated from Data/anime.csv and templates/*.html. Do not edit by hand."""\n\n'
    f"DATA_GZIP_BASE64 = {encoded!r}\n\n"
    f"TEMPLATES = {templates!r}\n",
    encoding="utf-8",
)
print(f"Wrote {output.name} ({output.stat().st_size} bytes)")
