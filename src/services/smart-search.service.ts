/**
 * Smart Flight Search Service
 *
 * @deprecated Legacy SDK removed. Flight search is now handled by Gauss FlightAgent
 * via the supervisor delegation in gauss-agents. This file is kept for type exports only.
 */

import type { FlightResult } from '../types';

// =============================================================================
// Types
// =============================================================================

export interface FlightSearchInput {
  flyFrom: string[];
  flyTo: string[];
  departureDate: string;
  returnDate?: string | null;
  maxResults?: number;
  currency?: string;
  preferences?: {
    priority?: 'price' | 'duration' | 'convenience';
    preferDirectFlights?: boolean;
    maxLayoverHours?: number;
    departureTimePreference?: 'morning' | 'afternoon' | 'evening' | 'any';
  };
}

export interface FlightAnalysis {
  marketSummary: string;
  priceAnalysis: {
    avgOutboundPrice: number;
    avgReturnPrice?: number;
    isPriceGood: boolean;
    priceTrend: string;
  };
  routeAnalysis: {
    bestOrigin?: string;
    originReason?: string;
    bestDestination?: string;
    destinationReason?: string;
  };
  scheduleAnalysis: {
    hasGoodDirectOptions: boolean;
    avgLayoverMinutes?: number;
    bestTimeToFly: string;
  };
  keyInsights: string[];
  savingsTips?: string[];
}

export interface FlightRecommendation {
  outboundFlightId: string;
  returnFlightId?: string;
  totalPrice: number;
  strategy: 'best_value' | 'cheapest' | 'fastest' | 'most_convenient' | 'flexible_combo';
  confidence: number;
  reasoning: string;
  deepLink?: string;
  outboundDeepLink?: string;
  returnDeepLink?: string;
}

export interface FlightSearchOutput {
  tripType: 'one-way' | 'round-trip';
  outbound: FlightResult[];
  return?: FlightResult[];
  analysis: FlightAnalysis;
  recommendation: FlightRecommendation;
  alternatives?: FlightRecommendation[];
  metadata: {
    searchedAt: string;
    totalResults: number;
    cheapestPrice?: number;
  };
}

export interface SmartSearchResult {
  success: boolean;
  data?: FlightSearchOutput;
  error?: {
    message: string;
    code: string;
  };
  meta: {
    executionId: string;
    durationMs: number;
    tokensUsed: number;
    costUSD: number;
  };
  /** Workflow run ID for durable mode - use for polling/resume (SDK v4.0+) */
  workflowRunId?: string;
  /** Workflow status for durable mode */
  workflowStatus?: 'pending' | 'running' | 'paused' | 'completed' | 'failed' | 'cancelled';
}

// =============================================================================
// Main Function (deprecated — throws at runtime)
// =============================================================================

/**
 * @deprecated Use Gauss FlightAgent via supervisor delegation instead.
 * This function is kept for API compatibility but always throws.
 */
export async function smartFlightSearch(
  _input: FlightSearchInput,
  _userId: string
): Promise<SmartSearchResult> {
  throw new Error(
    '[SmartSearch] Legacy SDK removed. Use Gauss FlightAgent via the CoachNetwork supervisor.'
  );
}
