import mongoose, { Model } from 'mongoose';
import { logger } from '../utils/logger.js';

export interface ExpectedIndexRule {
  fields: Record<string, 1 | -1 | '2dsphere' | 'text' | string | number>;
  options?: {
    unique?: boolean;
    name?: string;
    sparse?: boolean;
    weights?: Record<string, number>;
  };
}

export interface ModelIndexSpecification {
  modelName: string;
  criticalRules: ExpectedIndexRule[];
}

export interface IndexAuditEntry {
  collection: string;
  modelName: string;
  status: 'SYNCHRONIZED' | 'WARNING' | 'FAILED';
  existingIndexes: string[];
  missingRules: string[];
  error?: string;
}

export interface IndexVerificationSummary {
  success: boolean;
  durationMs: number;
  totalModelsAudited: number;
  totalIndexesCreatedOrVerified: number;
  results: IndexAuditEntry[];
  issues: string[];
}

/**
 * Canonical specifications for MongoDB Compound Indexes strictly enforcing
 * the ESR Rule (Equality, Sort, Range) across high-velocity collections.
 */
export const CANONICAL_INDEX_SPECIFICATIONS: ModelIndexSpecification[] = [
  {
    modelName: 'Order',
    criticalRules: [
      { fields: { storeId: 1, status: 1, createdAt: -1 } }, // Merchant live orders board (ESR)
      { fields: { userId: 1, createdAt: -1 } },             // Customer order history
      { fields: { status: 1, createdAt: 1 } },              // Stale order auto-expiry worker
    ],
  },
  {
    modelName: 'Product',
    criticalRules: [
      { fields: { storeId: 1, isActive: 1, createdAt: -1 } }, // Filtered catalog queries (ESR)
      { fields: { isActive: 1, category: 1, storeId: 1 } },   // Store category discovery
      { fields: { isActive: 1, basePrice: 1 } },              // Price range & sorting
      { fields: { isActive: 1, rating: -1, createdAt: -1 } }, // Quality sorting
    ],
  },
  {
    modelName: 'Store',
    criticalRules: [
      { fields: { location: '2dsphere' } },                   // Hyperlocal spatial discovery
      { fields: { approvalStatus: 1, isActive: 1, category: 1 } }, // Active approved store queries
    ],
  },
  {
    modelName: 'Invoice',
    criticalRules: [
      { fields: { storeId: 1, invoiceNumber: 1 }, options: { unique: true } },
      { fields: { storeId: 1, 'payment.status': 1, createdAt: -1 } }, // Payment reconciliation
      { fields: { storeId: 1, 'dates.invoiceDate': -1 } },
    ],
  },
  {
    modelName: 'Quote',
    criticalRules: [
      { fields: { storeId: 1, quoteNumber: 1 }, options: { unique: true } },
      { fields: { storeId: 1, status: 1, createdAt: -1 } },
    ],
  },
  {
    modelName: 'Delivery',
    criticalRules: [
      { fields: { storeId: 1, status: 1, createdAt: -1 } },
      { fields: { orderId: 1, status: 1 } },
      { fields: { 'rider.id': 1, status: 1, createdAt: -1 } },
      { fields: { status: 1, createdAt: -1 } },
    ],
  },
  {
    modelName: 'Outbox',
    criticalRules: [
      { fields: { status: 1, availableAt: 1, createdAt: 1 } }, // Transactional outbox polling
    ],
  },
];

/**
 * Compares two index key objects to determine whether a given field configuration matches.
 */
function isKeyMatch(
  existingKey: Record<string, unknown>,
  targetFields: Record<string, unknown>,
): boolean {
  const existingKeys = Object.keys(existingKey);
  const targetKeys = Object.keys(targetFields);

  if (existingKeys.length !== targetKeys.length) return false;

  return targetKeys.every((key, index) => {
    return (
      existingKeys[index] === key &&
      String(existingKey[key]) === String(targetFields[key])
    );
  });
}

/**
 * Ensures and synchronizes all MongoDB compound indexes across active Mongoose models.
 * Essential for production environments where Mongoose's autoIndex is disabled.
 */
export async function ensureIndexes(options?: {
  verbose?: boolean;
}): Promise<IndexVerificationSummary> {
  const startTime = Date.now();
  const verbose = options?.verbose ?? false;
  const issues: string[] = [];
  const results: IndexAuditEntry[] = [];
  let totalIndexesCount = 0;

  try {
    const registeredModelNames = mongoose.modelNames();

    for (const spec of CANONICAL_INDEX_SPECIFICATIONS) {
      if (!registeredModelNames.includes(spec.modelName)) {
        // Model might not be loaded yet in lightweight test runs or selective workers
        continue;
      }

      const model = mongoose.model(spec.modelName) as Model<unknown>;
      const collectionName = model.collection?.name || spec.modelName.toLowerCase();
      const auditEntry: IndexAuditEntry = {
        collection: collectionName,
        modelName: spec.modelName,
        status: 'SYNCHRONIZED',
        existingIndexes: [],
        missingRules: [],
      };

      try {
        // 1. Explicitly trigger index creation on the model
        await model.createIndexes();

        // 2. Query MongoDB's collection for active indexes
        const liveIndexes = await model.collection.listIndexes().toArray();
        auditEntry.existingIndexes = liveIndexes.map((idx) => idx.name || JSON.stringify(idx.key));
        totalIndexesCount += liveIndexes.length;

        // 3. Cross-reference against canonical ESR rules
        for (const rule of spec.criticalRules) {
          const matched = liveIndexes.some((idx) => isKeyMatch(idx.key as Record<string, unknown>, rule.fields));
          if (!matched) {
            const ruleDesc = JSON.stringify(rule.fields);
            auditEntry.missingRules.push(ruleDesc);
            auditEntry.status = 'WARNING';
            const issueMsg = `Model ${spec.modelName} (${collectionName}) missing compound index: ${ruleDesc}`;
            issues.push(issueMsg);
            logger.warn(`⚠️ [IndexManager] ${issueMsg}`);
          }
        }

        if (verbose) {
          logger.debug(
            `📦 [IndexManager] ${spec.modelName} verified: ${liveIndexes.length} active indexes`,
          );
        }
      } catch (err: unknown) {
        auditEntry.status = 'FAILED';
        auditEntry.error = err instanceof Error ? err.message : String(err);
        const errMsg = `Failed to audit/create indexes on ${spec.modelName}: ${auditEntry.error}`;
        issues.push(errMsg);
        logger.error(`❌ [IndexManager] ${errMsg}`);
      }

      results.push(auditEntry);
    }

    const durationMs = Date.now() - startTime;
    const summary: IndexVerificationSummary = {
      success: issues.length === 0,
      durationMs,
      totalModelsAudited: results.length,
      totalIndexesCreatedOrVerified: totalIndexesCount,
      results,
      issues,
    };

    if (summary.success) {
      logger.info(
        `📦 [IndexManager] Verified & synchronized ${summary.totalModelsAudited} collections (${totalIndexesCount} indexes) in ${durationMs}ms`,
      );
    } else {
      logger.warn(
        `⚠️ [IndexManager] Index synchronization completed with ${issues.length} warning(s) in ${durationMs}ms`,
      );
    }

    return summary;
  } catch (globalErr: unknown) {
    const durationMs = Date.now() - startTime;
    const errMessage = globalErr instanceof Error ? globalErr.message : String(globalErr);
    logger.error(`❌ [IndexManager] Fatal index audit error: ${errMessage}`);

    return {
      success: false,
      durationMs,
      totalModelsAudited: results.length,
      totalIndexesCreatedOrVerified: totalIndexesCount,
      results,
      issues: [...issues, `Fatal error: ${errMessage}`],
    };
  }
}

/**
 * Pure health check utility returning boolean status and any detected index discrepancies.
 */
export async function checkIndexHealth(): Promise<{ isHealthy: boolean; issues: string[] }> {
  const summary = await ensureIndexes({ verbose: false });
  return {
    isHealthy: summary.success,
    issues: summary.issues,
  };
}
