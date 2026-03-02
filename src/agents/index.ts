/**
 * Flight Agents
 *
 * DEPRECATED: Legacy OneAgent SDK 3.1 agent. Flight search now uses Gauss agents.
 * Kept for type exports and backward compatibility.
 */

// Legacy one-agent SDK imports removed
// Side-effect import to register schemas (now no-ops)
import '../sdk-agents/flight-search/schema';
import type { FlightSearchInput as SDKFlightSearchInput, FlightSearchOutput } from '../sdk-agents/flight-search/schema';

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
}

/**
 * Execute a flight search using the OneAgent SDK 3.1 workflow.
 * @deprecated Use Gauss flight agent instead.
 */
export async function executeFlightSearch(
  input: SDKFlightSearchInput,
  options: FlightAgentOptions
): Promise<FlightExecutionResult<FlightSearchOutput>> {
  throw new Error('Legacy executeFlightSearch() is deprecated. Use Gauss flight agent instead.');
}
