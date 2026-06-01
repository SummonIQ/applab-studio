-- Enable pgvector extension for vector similarity search
CREATE EXTENSION IF NOT EXISTS vector;

-- CreateEnum
CREATE TYPE "EmbeddingSourceType" AS ENUM ('PROJECT_MEMORY', 'KNOWLEDGE_DOCUMENT', 'AGENT_MEMORY', 'BEST_PRACTICE', 'COMPONENT', 'CONFIG_TEMPLATE', 'TICKET', 'CODEBASE_FILE');

-- CreateEnum
CREATE TYPE "EmbeddingJobStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "EmbeddingStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'STALE');

-- CreateTable
CREATE TABLE "embeddings" (
    "id" TEXT NOT NULL,
    "sourceType" "EmbeddingSourceType" NOT NULL,
    "sourceId" TEXT NOT NULL,
    "chunkIndex" INTEGER NOT NULL DEFAULT 0,
    "contentText" TEXT NOT NULL,
    "contentHash" TEXT NOT NULL,
    "projectId" TEXT,
    "category" TEXT,
    "importance" INTEGER NOT NULL DEFAULT 5,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "embeddings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "embedding_jobs" (
    "id" TEXT NOT NULL,
    "sourceType" "EmbeddingSourceType" NOT NULL,
    "sourceId" TEXT NOT NULL,
    "status" "EmbeddingJobStatus" NOT NULL DEFAULT 'PENDING',
    "totalChunks" INTEGER NOT NULL DEFAULT 0,
    "processedChunks" INTEGER NOT NULL DEFAULT 0,
    "errorMessage" TEXT,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "embedding_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "query_embedding_cache" (
    "id" TEXT NOT NULL,
    "queryHash" TEXT NOT NULL,
    "queryText" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "query_embedding_cache_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "embeddings_sourceType_sourceId_chunkIndex_key" ON "embeddings"("sourceType", "sourceId", "chunkIndex");

-- CreateIndex
CREATE INDEX "embeddings_sourceType_sourceId_idx" ON "embeddings"("sourceType", "sourceId");

-- CreateIndex
CREATE INDEX "embeddings_projectId_idx" ON "embeddings"("projectId");

-- CreateIndex
CREATE INDEX "embeddings_category_idx" ON "embeddings"("category");

-- CreateIndex
CREATE INDEX "embeddings_contentHash_idx" ON "embeddings"("contentHash");

-- CreateIndex
CREATE INDEX "embedding_jobs_status_idx" ON "embedding_jobs"("status");

-- CreateIndex
CREATE INDEX "embedding_jobs_sourceType_sourceId_idx" ON "embedding_jobs"("sourceType", "sourceId");

-- CreateIndex
CREATE UNIQUE INDEX "query_embedding_cache_queryHash_key" ON "query_embedding_cache"("queryHash");

-- CreateIndex
CREATE INDEX "query_embedding_cache_expiresAt_idx" ON "query_embedding_cache"("expiresAt");

-- Add vector columns for embeddings (1536 dimensions for text-embedding-3-small)
ALTER TABLE "embeddings" ADD COLUMN "embedding" vector(1536);
ALTER TABLE "query_embedding_cache" ADD COLUMN "embedding" vector(1536);

-- Create HNSW indexes for fast approximate nearest neighbor search
CREATE INDEX embeddings_embedding_hnsw_idx ON "embeddings"
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

CREATE INDEX query_cache_embedding_hnsw_idx ON "query_embedding_cache"
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

-- Create partial index for project-filtered queries (common access pattern)
CREATE INDEX embeddings_project_embedding_hnsw_idx ON "embeddings"
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64)
WHERE "projectId" IS NOT NULL;

-- Add embeddingStatus to existing models
ALTER TABLE "config_templates" ADD COLUMN "embeddingStatus" "EmbeddingStatus" NOT NULL DEFAULT 'PENDING';
ALTER TABLE "config_templates" ADD COLUMN "embeddedAt" TIMESTAMP(3);
CREATE INDEX "config_templates_embeddingStatus_idx" ON "config_templates"("embeddingStatus");

ALTER TABLE "best_practices" ADD COLUMN "embeddingStatus" "EmbeddingStatus" NOT NULL DEFAULT 'PENDING';
ALTER TABLE "best_practices" ADD COLUMN "embeddedAt" TIMESTAMP(3);
CREATE INDEX "best_practices_embeddingStatus_idx" ON "best_practices"("embeddingStatus");

ALTER TABLE "project_memories" ADD COLUMN "embeddingStatus" "EmbeddingStatus" NOT NULL DEFAULT 'PENDING';
ALTER TABLE "project_memories" ADD COLUMN "embeddedAt" TIMESTAMP(3);
CREATE INDEX "project_memories_embeddingStatus_idx" ON "project_memories"("embeddingStatus");

ALTER TABLE "tickets" ADD COLUMN "embeddingStatus" "EmbeddingStatus" NOT NULL DEFAULT 'PENDING';
ALTER TABLE "tickets" ADD COLUMN "embeddedAt" TIMESTAMP(3);
CREATE INDEX "tickets_embeddingStatus_idx" ON "tickets"("embeddingStatus");

ALTER TABLE "knowledge_documents" ADD COLUMN "embeddingStatus" "EmbeddingStatus" NOT NULL DEFAULT 'PENDING';
ALTER TABLE "knowledge_documents" ADD COLUMN "embeddedAt" TIMESTAMP(3);
CREATE INDEX "knowledge_documents_embeddingStatus_idx" ON "knowledge_documents"("embeddingStatus");

ALTER TABLE "agent_memories" ADD COLUMN "embeddingStatus" "EmbeddingStatus" NOT NULL DEFAULT 'PENDING';
ALTER TABLE "agent_memories" ADD COLUMN "embeddedAt" TIMESTAMP(3);
CREATE INDEX "agent_memories_embeddingStatus_idx" ON "agent_memories"("embeddingStatus");

ALTER TABLE "components" ADD COLUMN "embeddingStatus" "EmbeddingStatus" NOT NULL DEFAULT 'PENDING';
ALTER TABLE "components" ADD COLUMN "embeddedAt" TIMESTAMP(3);
CREATE INDEX "components_embeddingStatus_idx" ON "components"("embeddingStatus");
