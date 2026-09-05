# LAMLA AI Dataset Engineering

Current phase: **Phase 16 — KNUST web pilot**

This document describes how authorized academic sources will enter LAMLA. It is not a corpus and does not list KNUST courses.

## Purpose

Later retrieval and RAG phases can only use sources that were:

1. Explicitly authorized
2. Attributed
3. Stored privately
4. Linked to an academic context when that context exists

Phase 2 builds those rules. It does not collect files and does not invent a course catalog.

## Collection model

```text
authorization + attribution
        ↓
manifest (datasets/manifests)
        ↓
incoming file (datasets/incoming, gitignored)
        ↓
ingestion gate + text extract + chunk (Phase 3)
        ↓
academic_resources row (only after a real course exists)
```

A manifest is a collection record. It is not a lecture note and not a student-facing document.

## Required manifest fields

- `schemaVersion` — currently `1`
- `id` — lowercase slug, unique
- `title`
- `kind` — one of the Phase 1 resource kinds
- `sourceAttribution`
- `authorization.status` — `pending`, `granted`, or `denied`
- `programmeId` — official pilot programme ID from `src/config/pilot.ts`

Course code and title stay `null` until an authorized catalog row exists.

If `authorization.status` is `granted`, `authorizedBy` and `authorizedAt` are required.

## Storage convention

Suggested object keys:

```text
{programme-slug}/{course-code|_unassigned}/{kind}/{safe-filename}
```

The helper is `buildSuggestedStoragePath`. Paths must be relative and must not contain `..`.

Allowed MIME types match the private `academic-resources` bucket: PDF, PNG, JPEG, WebP, and plain text.

## Database

Phase 2 adds authorization columns on `academic_resources`. Students can read a row only when:

- `status = approved`
- `authorization_status = granted`

Staff can still see drafts and pending authorization.

## What is not here

- KNUST course lists
- Sample lecture notes or past questions
- PDF parsing or OCR
- Embeddings or retrieval
- Upload UI

Those belong to later phases that use real authorized sources.
