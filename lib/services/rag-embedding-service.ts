/**
 * RAG Embedding Service
 *
 * Provides a centralized service for wiring embedding hooks into CRUD flows.
 * Respects RAG_ENABLED and RAG_AUTO_INDEX environment variables.
 *
 * NOTE: RAG package temporarily disabled - embedding models not in schema yet
 */

// TODO: Re-enable when embedding models are added to schema
// import { prisma } from '@/lib/db/prisma';
// import { embeddingHooks, type EmbeddingHooksOptions } from '@summoniq/rag';

type EmbeddingHooksOptions = Record<string, unknown>;

/**
 * Check if RAG features are enabled
 * Currently always returns false until RAG package is re-enabled
 */
export function isRagEnabled(): boolean {
  return false; // RAG temporarily disabled
  // return process.env.RAG_ENABLED === 'true';
}

/**
 * Check if auto-indexing is enabled
 */
export function isAutoIndexEnabled(): boolean {
  return process.env.RAG_AUTO_INDEX === 'true';
}

/**
 * Embeddable model types
 */
export type EmbeddableModel =
  | 'ProjectMemory'
  | 'KnowledgeDocument'
  | 'AgentMemory'
  | 'BestPractice'
  | 'Component'
  | 'ConfigTemplate'
  | 'Ticket';

/**
 * RAG Embedding Service - wraps embedding hooks with config checks
 */
export const ragEmbeddingService = {
  /**
   * Queue embedding for a newly created item
   * No-op - RAG temporarily disabled
   */
  async onCreated(
    _model: EmbeddableModel,
    _id: string,
    _options?: Partial<EmbeddingHooksOptions>,
  ): Promise<void> {
    // RAG disabled - no-op
    return;
  },

  /**
   * Mark content as stale when updated (will be re-embedded)
   * No-op - RAG temporarily disabled
   */
  async onUpdated(
    _model: EmbeddableModel,
    _id: string,
    _changedFields: string[],
    _options?: Partial<EmbeddingHooksOptions>,
  ): Promise<void> {
    // RAG disabled - no-op
    return;
  },

  /**
   * Delete embeddings when source content is deleted
   * No-op - RAG temporarily disabled
   */
  async onDeleted(
    _model: EmbeddableModel,
    _id: string,
    _options?: Partial<EmbeddingHooksOptions>,
  ): Promise<void> {
    // RAG disabled - no-op
    return;
  },

  /**
   * Get the list of fields that trigger re-embedding for each model
   */
  getContentFields(model: EmbeddableModel): string[] {
    const fields: Record<EmbeddableModel, string[]> = {
      ProjectMemory: ['content', 'category', 'tags', 'title'],
      KnowledgeDocument: ['title', 'content', 'category', 'tags'],
      AgentMemory: ['key', 'value', 'context', 'type', 'scope', 'scopeId'],
      BestPractice: ['title', 'description', 'content', 'examples', 'tags'],
      Component: ['name', 'description', 'code', 'usage', 'props', 'category'],
      ConfigTemplate: ['name', 'description', 'content', 'rawContent'],
      Ticket: ['title', 'description'],
    };
    return fields[model];
  },

  /**
   * Helper to detect which content fields changed in an update
   */
  detectChangedContentFields(
    model: EmbeddableModel,
    updateData: Record<string, unknown>,
  ): string[] {
    const contentFields = this.getContentFields(model);
    return Object.keys(updateData).filter(key => contentFields.includes(key));
  },
};

export default ragEmbeddingService;
