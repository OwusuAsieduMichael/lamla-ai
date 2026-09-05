# LAMLA AI Document Ingestion

Current phase: **Phase 16 — KNUST web pilot**

This document describes how authorized files become text chunks. It is not a retrieval engine and does not embed documents.

## Pipeline

```text
granted manifest + incoming file
        ↓
gate (authorization, attribution, path, checksum, MIME)
        ↓
extract text
        ↓
chunk
        ↓
ingestion_jobs + resource_chunks
```

The pipeline is implemented in `src/lib/ingestion`. `npm run ingest` reports whether anything is eligible. Zero authorized files is the current valid state.

## Gate

Ingestion is skipped when:

- authorization is not `granted`
- attribution is missing
- the incoming file is missing
- the storage path is unsafe
- checksums do not match
- the MIME type is an image (Computer Vision is Phase 8)
- the MIME type is PDF (parser is not wired until an authorized PDF exists)
- the MIME type is otherwise unsupported

Plain text is the only extractor wired in Phase 3.

## Chunking

Text is normalized, then split with overlap (`800` characters, `120` overlap). Token counts are estimated as `ceil(chars / 4)`. Chunk text must stay attributable to the source manifest. The pipeline does not invent course content.

## Database

- `ingestion_jobs` records a run: status, skip reason, extracted size, chunk count
- `resource_chunks` stores extracted windows, optional embeddings, and optional importance scores
- Students may read chunks only when the parent resource is approved and granted
- Staff can read and write through RLS
- `match_resource_chunks` exists for vector search and returns no rows without embeddings

## What is not here

- KNUST course files or invented notes
- PDF or image extraction as a live reader
- A populated retrieval corpus
- Upload UI for students
