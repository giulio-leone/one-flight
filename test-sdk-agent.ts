#!/usr/bin/env tsx
/**
 * Test OneAgent SDK 3.0 - OneFlight SmartSearch
 * 
 * Verifica che il framework funzioni correttamente con:
 * - MCP Kiwi.com via HTTP/SSE
 * - ToolLoopAgent con Output.object()
 * - Execution mode (stream by default)
 * 
 * NOTA: Questo test richiede che:
 * 1. I pacchetti siano buildati (pnpm build dal root)
 * 2. Le variabili d'ambiente API keys siano configurate
 */

import { resolve } from 'path';

async function testFlightSearch() {
  console.log('🧪 Testing OneAgent SDK 3.0 - OneFlight SmartSearch\n');
  console.log('━'.repeat(80));

  // Dynamic import per evitare problemi di build al parse time
  const { execute } = await import('@giulio-leone/one-agent/framework');
  const schemas = await import('./src/sdk-agents/flight-search/schema.js');
  
  const { FlightSearchInputSchema, FlightSearchOutputSchema } = schemas;
  type FlightSearchOutput = ReturnType<typeof FlightSearchOutputSchema.parse>;

  const input = {
    flyFrom: ['MXP'],        // Milano Malpensa
    flyTo: ['BCN'],          // Barcelona
    departureDate: '2025-02-15',
    returnDate: '2025-02-22',
    maxResults: 3,
    currency: 'EUR',
    preferences: {
      priority: 'best_value' as const,
      preferDirectFlights: true,
      maxLayoverHours: 4,
      departureTimePreference: 'any' as const,
    },
  };

  // Validate input
  const validatedInput = FlightSearchInputSchema.parse(input);

  console.log('📋 Input:');
  console.log(JSON.stringify(validatedInput, null, 2));
  console.log('\n' + '━'.repeat(80));
  console.log('🚀 Executing agent...\n');

  const startTime = Date.now();

  try {
    const basePath = resolve(process.cwd(), 'submodules/one-flight');
    
    const result = await execute<FlightSearchOutput>(
      'src/sdk-agents/flight-search',
      validatedInput,
      {
        userId: 'test-user-sdk-v3',
        basePath,
      }
    );

    const duration = Date.now() - startTime;

    console.log('━'.repeat(80));

    if (result.success && result.output) {
      console.log('✅ SUCCESS!\n');

      const output = result.output;

      // Summary
      console.log('📊 Summary:');
      console.log(`  Trip Type: ${output.tripType}`);
      console.log(`  Total Results: ${output.metadata.totalResults}`);
      console.log(`  Cheapest Price: €${output.metadata.cheapestPrice ?? 'N/A'}`);
      console.log(`  Search Duration: ${output.metadata.searchDurationMs ?? 'N/A'}ms`);

      // Outbound flights
      console.log('\n✈️  Outbound Flights:');
      output.outbound.slice(0, 3).forEach((flight, i) => {
        const layoverInfo = flight.layovers?.length 
          ? ` (${flight.layovers.length} stop${flight.layovers.length > 1 ? 's' : ''})`
          : ' (Direct)';
        console.log(`  ${i + 1}. ${flight.cityFrom} → ${flight.cityTo}: €${flight.price}${layoverInfo}`);
        console.log(`     Departs: ${new Date(flight.departure.local).toLocaleString()}`);
      });

      // Return flights
      if (output.return && output.return.length > 0) {
        console.log('\n🔙 Return Flights:');
        output.return.slice(0, 3).forEach((flight, i) => {
          const layoverInfo = flight.layovers?.length 
            ? ` (${flight.layovers.length} stop${flight.layovers.length > 1 ? 's' : ''})`
            : ' (Direct)';
          console.log(`  ${i + 1}. ${flight.cityFrom} → ${flight.cityTo}: €${flight.price}${layoverInfo}`);
          console.log(`     Departs: ${new Date(flight.departure.local).toLocaleString()}`);
        });
      }

      // Analysis
      console.log('\n🔍 AI Analysis:');
      console.log(`  Market Summary: ${output.analysis.marketSummary}`);
      console.log(`  Price Good?: ${output.analysis.priceAnalysis.isPriceGood ? 'Yes ✓' : 'No ✗'}`);
      console.log(`  Price Trend: ${output.analysis.priceAnalysis.priceTrend}`);
      console.log(`  Direct Options?: ${output.analysis.scheduleAnalysis.hasGoodDirectOptions ? 'Yes ✓' : 'No ✗'}`);

      // Recommendation
      console.log('\n💡 AI Recommendation:');
      console.log(`  Strategy: ${output.recommendation.strategy}`);
      console.log(`  Total Price: €${output.recommendation.totalPrice}`);
      console.log(`  Confidence: ${(output.recommendation.confidence * 100).toFixed(0)}%`);
      console.log(`  Reasoning: ${output.recommendation.reasoning}`);

      // Key Insights
      if (output.analysis.keyInsights.length > 0) {
        console.log('\n💎 Key Insights:');
        output.analysis.keyInsights.forEach((insight, i) => {
          console.log(`  ${i + 1}. ${insight}`);
        });
      }

      // Framework stats
      console.log('\n' + '━'.repeat(80));
      console.log('📈 Framework Stats:');
      console.log(`  Execution ID: ${result.meta.executionId}`);
      console.log(`  Total Duration: ${duration}ms`);
      console.log(`  Agent Duration: ${result.meta.duration}ms`);
      console.log(`  Tokens Used: ${result.meta.tokensUsed}`);
      console.log(`  Cost: $${result.meta.costUSD.toFixed(4)}`);

    } else {
      console.log('❌ FAILED\n');
      console.log(`Error Code: ${result.error?.code}`);
      console.log(`Error Message: ${result.error?.message}`);
      console.log(`Recoverable: ${result.error?.recoverable ? 'Yes' : 'No'}`);
      
      console.log('\n📈 Metadata:');
      console.log(`  Execution ID: ${result.meta.executionId}`);
      console.log(`  Duration: ${duration}ms`);
    }

    console.log('━'.repeat(80));

  } catch (error) {
    console.log('━'.repeat(80));
    console.log('💥 EXCEPTION\n');
    console.error(error);
    console.log('━'.repeat(80));
    process.exit(1);
  }
}

// Run test
testFlightSearch().catch((error: unknown) => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
