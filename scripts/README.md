# Scripts

- `check-env.mjs` reports whether known environment variable names are set. It never prints values.
- `validate-manifests.mjs` validates JSON files in `datasets/manifests`. An empty folder is valid.
- `ingest.mjs` reports whether any authorized incoming files are eligible. Zero files is valid.
- `evaluate.mjs` runs grounding tests. An empty corpus must refuse.
