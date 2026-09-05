-- Phase 1 — extensions required by the academic schema.
-- pgvector is enabled now so later retrieval work does not need a retrofit.
-- Embedding tables and ingestion pipelines are not created in this phase.

create extension if not exists pgcrypto;
create extension if not exists vector;
