/**
 * Flight Agents
 *
 * Exposes OneAgent SDK 3.1-based flight search agent.
 * The agent is defined in sdk-agents/flight-search and uses the workflow/worker pattern.
 *
 * Usage:
 * ```typescript
 * import { executeFlightSearch } from '@giulio-leone/one-flight/agents';
 *
 * const result = await executeFlightSearch({
 *   flyFrom: ['MXP'],
 *   flyTo: ['BCN'],
 *   departureDate: '2025-02-15',
 * }, { userId: 'user_123' });
 * ```
 */

import { execute as sdkExecute } from '@giulio-leone/one-agent/framework/engine';
import { createInMemoryAdapter } from '@giulio-leone/one-agent/framework/persistence';
import type { PersistenceAdapter } from '@giulio-leone/agent-contracts';
// Side-effect import to register schemas in the SDK registry
import '../sdk-agents/flight-search/schema';
import type { FlightSearchInput as SDKFlightSearchInput, FlightSearchOutput } from '../sdk-agents/flight-search/schema';
import path from 'path';

// Export SDK-based types under distinct names to avoid conflict with ./types
export type { FlightSearchOutput as SDKFlightSearchOutput };

/** Self-contained result type for flight search execution (mirrors ExecutionResult from agent-contracts). */
export interface FlightExecutionResult<T = unknown> {
  success: boolean;
  output?: T;
  error?: {
    message: string;
    code: string;
    recoverable: boolean;
  };
  meta: {
    executionId: string;
    duration: number;
    tokensUsed: number;
    costUSD: number;
  };
}

export interface FlightAgentOptions {
  userId: string;
  /** Prisma or in-memory adapter for persistence */
  persistence?: PersistenceAdapter;
}

/**
 * Execute a flight search using the OneAgent SDK 3.1 workflow.
 */
export async function executeFlightSearch(
  input: SDKFlightSearchInput,
  options: FlightAgentOptions
): Promise<FlightExecutionResult<FlightSearchOutput>> {
  const persistence = options.persistence ?? createInMemoryAdapter();

  // sdkExecute returns ExecutionResult | DurableExecutionResult (structurally identical
  // to FlightExecutionResult) but cross-package type resolution prevents direct assignment.
  const result = await sdkExecute<FlightSearchOutput>(
    'sdk-agents/flight-search',
    input,
    {
      userId: options.userId,
      persistence,
      basePath: path.resolve(__dirname, '..'),
    }
  );

  return result as FlightExecutionResult<FlightSearchOutput>;
}



