# Datasets

Phase 2 prepares authorized resource collection. It does not contain KNUST course files.

## Layout

```text
datasets/
├── manifests/   JSON collection records (none yet)
└── incoming/    Authorized binary files (gitignored)
```

## Rules

1. Do not invent course codes, lecture notes, slides, or past questions.
2. Every collected item needs a manifest with `sourceAttribution`.
3. `authorization.status` must be `granted`, with `authorizedBy` and `authorizedAt`, before a file may be treated as usable.
4. Course fields stay `null` until an authorized catalog row exists.
5. Put binaries only in `incoming/` after the matching manifest is valid.
6. Suggested storage paths come from `buildSuggestedStoragePath` and stay under the private `academic-resources` bucket.

Validate manifests with:

```bash
npm run validate:manifests
```

Zero manifests is a valid Phase 2 state.
