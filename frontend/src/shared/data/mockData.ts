export type AutoPart = {
  id: number;
  name: string;
  category: string;
  zone: string;
  price: number;
  stock: number;
  compatibility: string;
  description: string;
};

export type AutoService = {
  id: number;
  name: string;
  type: "PLATFORM_PARTNER" | "RAR_ITP_MOCK" | "ROAD_ASSISTANCE";
  address: string;
  rating: number;
  lat: number;
  lng: number;
};

export const parts: AutoPart[] = [
  { id: 1, name: "Baterie Bosch 70Ah", category: "Electric", zone: "battery", price: 420, stock: 12, compatibility: "Volkswagen Golf 7", description: "Pornire sigură, tehnologie AGM și garanție 24 luni." },
  { id: 2, name: "Filtru aer premium", category: "Filtre", zone: "engine", price: 89, stock: 28, compatibility: "Volkswagen Golf 7", description: "Debit optim și protecție avansată pentru motor." },
  { id: 3, name: "Plăcuțe frână ceramic", category: "Frânare", zone: "brakes", price: 285, stock: 18, compatibility: "Volkswagen Golf 7", description: "Frânare silențioasă și rezistență ridicată la temperatură." },
  { id: 4, name: "Far LED Matrix stânga", category: "Iluminare", zone: "headlights", price: 1850, stock: 2, compatibility: "Audi A4 B9", description: "Modul LED complet cu reglaj automat." },
  { id: 5, name: "Amortizor față gaz", category: "Suspensie", zone: "wheels", price: 320, stock: 11, compatibility: "Dacia Logan III", description: "Control îmbunătățit și confort pe drumuri denivelate." },
  { id: 6, name: "Alternator 180A", category: "Electric", zone: "engine", price: 980, stock: 4, compatibility: "BMW Seria 3 G20", description: "Alternator recondiționat profesional, testat pe banc." },
];

export const services: AutoService[] = [
  { id: 1, name: "AutoTech Nord", type: "PLATFORM_PARTNER", address: "Șoseaua Pipera 46", rating: 4.8, lat: 44.4801, lng: 26.1089 },
  { id: 2, name: "Rapid ITP Colentina", type: "RAR_ITP_MOCK", address: "Șoseaua Colentina 318", rating: 4.6, lat: 44.4629, lng: 26.1541 },
  { id: 3, name: "RoadHelp 24", type: "ROAD_ASSISTANCE", address: "Bd. Timișoara 92", rating: 4.9, lat: 44.4232, lng: 26.0098 },
  { id: 4, name: "Garage Performance", type: "PLATFORM_PARTNER", address: "Calea Floreasca 169", rating: 4.7, lat: 44.4758, lng: 26.1037 },
  { id: 5, name: "ITP Titan", type: "RAR_ITP_MOCK", address: "Bd. 1 Decembrie 1918 33", rating: 4.5, lat: 44.4208, lng: 26.1747 },
  { id: 6, name: "Auto Electric Pro", type: "PLATFORM_PARTNER", address: "Str. Viitorului 88", rating: 4.8, lat: 44.4527, lng: 26.1076 },
  { id: 7, name: "Platforma București", type: "ROAD_ASSISTANCE", address: "Șoseaua Giurgiului 288", rating: 4.7, lat: 44.3751, lng: 26.0908 },
  { id: 8, name: "West Side Motors", type: "PLATFORM_PARTNER", address: "Bd. Iuliu Maniu 244", rating: 4.4, lat: 44.4336, lng: 25.9822 },
  { id: 9, name: "ITP Berceni", type: "RAR_ITP_MOCK", address: "Șoseaua Berceni 104", rating: 4.6, lat: 44.3748, lng: 26.1357 },
  { id: 10, name: "Green Auto Service", type: "PLATFORM_PARTNER", address: "Splaiul Unirii 450", rating: 4.9, lat: 44.3987, lng: 26.1732 },
];

