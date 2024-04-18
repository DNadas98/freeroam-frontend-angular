export interface DetailedGeoLocationDto {
  latitude: number;
  longitude: number;
  elevation?: number;
  displayName: string;
  properties: GeoJsonProperties;
  licence: string;
}

interface GeoJsonProperties {
  place_id?: number;
  osm_type?: string;
  osm_id?: number;
  place_rank?: number;
  category?: string;
  type?: string;
  importance?: number;
  addresstype?: string;
  name?: string;
  display_name?: string;
  address?: GeoJsonAddress;
}

interface GeoJsonAddress {
  road?: string;
  neighbourhood?: string;
  suburb?: string;
  borough?: string;
  city?: string;
  county?: string;
  state_district?: string;
  state?: string;
  postcode?: string;
  country?: string;
  country_code?: string;
  region?: string;
  ISO3166_2_lvl4?: string;
  ISO3166_2_lvl6?: string;
}
