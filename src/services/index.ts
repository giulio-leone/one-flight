/**
 * Flight Services
 *
 * Contains the FlightSearchService for orchestrating flight searches.
 */

export { FlightSearchService } from './flight-search.service';

// Smart Search types (service deprecated — use Gauss FlightAgent)
export {
  smartFlightSearch,
  type SmartSearchResult,
  type FlightSearchInput as SmartSearchInput,
  type FlightSearchOutput as SmartSearchOutput,
} from './smart-search.service';
