export interface Listing {
  id: string
  title: string
  building: string
  unit: string
  neighborhood: string
  price: number
  priceMode: 'sale' | 'rent'
  type: 'condo' | 'home'
  beds: number
  baths: number
  sqft: number
  sqftMetric: number
  images: string[]
  description: string
  address: string
  featured: boolean
  createdAt: string
}

export interface Neighborhood {
  id: string
  name: string
  slug: string
  type: 'condo' | 'home' | 'both'
}

export interface Building {
  id: string
  name: string
  slug: string
  neighborhoodId: string
  units?: number
  subBuildings?: { id: string; name: string }[]
}

export interface Development {
  id: string
  name: string
  subtitle: string
  image: string
  neighborhood: string
  units: number
  floors: number
  delivery: string
  startingPrice: string
}

export interface SimplyRetsListing {
  mlsId: number
  listPrice: number
  listDate: string
  address: {
    full: string
    city: string
    state: string
    postalCode: string
    streetName: string
    streetNumber: number
    streetNumberText: string
  }
  property: {
    bedrooms: number
    bathsFull: number
    bathsHalf: number
    area: number
    type: string
    style: string
    yearBuilt: number
    stories: number
    subdivision: string
  }
  remarks: string
  photos: string[]
  virtualTourUrl?: string
  geo: {
    lat: number
    lng: number
  }
}

export interface SearchFilters {
  type?: 'condo' | 'home'
  mode?: 'sale' | 'rent'
  neighborhood?: string
  minPrice?: number
  maxPrice?: number
  beds?: number
  sort?: string
}

// Bridge API / RESO Web API types
export interface BridgeMedia {
  MediaURL: string
  MediaCategory: string
  Order: number
  ShortDescription: string
}

export interface BridgeListing {
  ListingKey: string
  ListingId: string
  StandardStatus: 'Active' | 'Pending' | 'ActiveUnderContract' | 'Closed' | 'Withdrawn'
  PropertyType: string
  PropertySubType: string
  ListPrice: number
  OriginalListPrice: number
  City: string
  StateOrProvince: string
  PostalCode: string
  StreetNumber: string
  StreetName: string
  UnitNumber: string | null
  CountyOrParish: string
  Country: string
  Latitude: number
  Longitude: number
  BedroomsTotal: number
  BathroomsTotalInteger: number
  BathroomsFull: number
  BathroomsHalf: number
  LivingArea: number
  LivingAreaUnits: string
  LotSizeArea: number
  LotSizeUnits: string
  YearBuilt: number
  StoriesTotal: number
  GarageSpaces: number
  ParkingTotal: number
  PoolPrivateYN: boolean
  WaterfrontYN: boolean
  ViewYN: boolean
  View: string[]
  Cooling: string[]
  Heating: string[]
  Appliances: string[]
  InteriorFeatures: string[]
  ExteriorFeatures: string[]
  CommunityFeatures: string[]
  AssociationFee: number
  AssociationFeeFrequency: string
  TaxAnnualAmount: number
  TaxYear: number
  PublicRemarks: string
  BuildingName: string | null
  OnMarketDate: string
  ModificationTimestamp: string
  ListingContractDate: string
  DaysOnMarket: number
  ListOfficeName: string
  ListAgentFullName: string
  ListAgentEmail: string
  ListAgentDirectPhone: string
  Media: BridgeMedia[]
  VirtualTourURLUnbranded: string | null
}
