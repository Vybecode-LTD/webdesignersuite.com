# Fonts

`tokens.css` names two families, and `src/styles/fonts.css` serves both from `src/assets/fonts/` (Vite hashes the files).

| Family | File | Source | Coverage | Size |
|---|---|---|---|---|
| Geist Sans | `geist-latin-wght-normal.woff2` | `@fontsource-variable/geist` 5.3.0, unchanged | Fontsource's Latin subset, weights 100 to 900 | 29.4 KB |
| JetBrains Mono | `jetbrains-mono-ascii-wght-normal.woff2` | `@fontsource-variable/jetbrains-mono` 5.3.0, subset | ASCII plus U+00A0, ©, ·, en and em dashes, curly quotes, …, →, ✓; weights 100 to 800 | 31.4 KB |

Both are SIL OFL 1.1 (the licences are beside the files). Neither names a Reserved Font Name, so the subset keeps its name.

`perf_audit.py` caps a single font at 40 KB. Fontsource's Latin JetBrains Mono is 40.4 KB, so it was cut with fontTools:

```bash
python -m pip install fonttools brotli
python -m fontTools.subset jetbrains-mono-latin-wght-normal.woff2 --unicodes="U+0020-007E,U+00A0,U+00A9,U+00B7,U+2013-2014,U+2018-2019,U+201C-201D,U+2026,U+2192,U+2713" --layout-features="*" --flavor=woff2 --output-file=jetbrains-mono-ascii-wght-normal.woff2
```

Keep `unicode-range` in `fonts.css` equal to that list. A character outside it falls back to the next font in `--font-mono`.

`Geist Sans Fallback` is Arial scaled to Geist's metrics, so the swap moves no line. The numbers in `fonts.css` were measured
from both files with fontTools; re-measure them if Geist's file changes.
