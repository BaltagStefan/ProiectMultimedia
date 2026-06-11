export type VehicleZoneId =
  | "hood"
  | "engine"
  | "wheels"
  | "brakes"
  | "headlights"
  | "trunk"
  | "battery"
  | "interior";

export interface VehicleComponent {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  serviceInterval: string;
}

export interface VehicleZone {
  id: VehicleZoneId;
  label: string;
  description: string;
  components: VehicleComponent[];
}

export const vehicleZones: VehicleZone[] = [
  {
    id: "hood",
    label: "Capotă",
    description: "Caroserie frontală și acces la compartimentul motor.",
    components: [
      { id: "hood-panel", name: "Panou capotă", description: "Panoul exterior din oțel al capotei.", price: 1480, stock: 4, serviceInterval: "La deteriorare" },
      { id: "hood-latch", name: "Încuietoare capotă", description: "Mecanismul central de blocare și siguranță.", price: 185, stock: 12, serviceInterval: "60.000 km" },
      { id: "hood-hinges", name: "Balamale capotă", description: "Set de balamale stânga și dreapta.", price: 240, stock: 8, serviceInterval: "La deteriorare" },
      { id: "hood-insulation", name: "Izolație termică", description: "Panou fonoabsorbant și termorezistent.", price: 310, stock: 7, serviceInterval: "La deteriorare" },
    ],
  },
  {
    id: "engine",
    label: "Motor",
    description: "Propulsie, admisie, răcire și încărcare electrică.",
    components: [
      { id: "engine-block", name: "Bloc motor", description: "Ansamblul principal al motorului termic.", price: 9250, stock: 2, serviceInterval: "Diagnostic anual" },
      { id: "cylinder-head", name: "Chiulasă", description: "Chiulasă completă cu capac superior.", price: 4200, stock: 3, serviceInterval: "120.000 km" },
      { id: "intake-manifold", name: "Galerie admisie", description: "Distribuie aerul către cilindri.", price: 760, stock: 9, serviceInterval: "60.000 km" },
      { id: "turbocharger", name: "Turbocompresor", description: "Supraalimentare cu geometrie variabilă.", price: 3180, stock: 5, serviceInterval: "90.000 km" },
      { id: "radiator", name: "Radiator", description: "Răcirea lichidului din circuitul motor.", price: 890, stock: 11, serviceInterval: "90.000 km" },
      { id: "alternator", name: "Alternator", description: "Generează energie pentru rețeaua de bord.", price: 980, stock: 4, serviceInterval: "120.000 km" },
      { id: "air-filter", name: "Filtru de aer", description: "Filtrează aerul înainte de admisie.", price: 89, stock: 28, serviceInterval: "15.000 km" },
    ],
  },
  {
    id: "wheels",
    label: "Roți",
    description: "Anvelope, jante, rulmenți și elemente de suspensie.",
    components: [
      { id: "wheel-fl", name: "Roată față stânga", description: "Ansamblu anvelopă și jantă față.", price: 780, stock: 14, serviceInterval: "10.000 km" },
      { id: "wheel-fr", name: "Roată față dreapta", description: "Ansamblu anvelopă și jantă față.", price: 780, stock: 14, serviceInterval: "10.000 km" },
      { id: "wheel-rl", name: "Roată spate stânga", description: "Ansamblu anvelopă și jantă spate.", price: 740, stock: 16, serviceInterval: "10.000 km" },
      { id: "wheel-rr", name: "Roată spate dreapta", description: "Ansamblu anvelopă și jantă spate.", price: 740, stock: 16, serviceInterval: "10.000 km" },
      { id: "suspension", name: "Suspensie", description: "Amortizoare, arcuri și brațe de control.", price: 1320, stock: 8, serviceInterval: "30.000 km" },
    ],
  },
  {
    id: "brakes",
    label: "Frâne",
    description: "Discuri, plăcuțe, etriere și control electronic ABS.",
    components: [
      { id: "brake-disc-front", name: "Discuri față", description: "Set de discuri ventilate pentru puntea față.", price: 620, stock: 10, serviceInterval: "40.000 km" },
      { id: "brake-disc-rear", name: "Discuri spate", description: "Set de discuri pentru puntea spate.", price: 510, stock: 9, serviceInterval: "50.000 km" },
      { id: "brake-calipers", name: "Etriere", description: "Set de etriere cu acționare hidraulică.", price: 1120, stock: 6, serviceInterval: "40.000 km" },
      { id: "abs-module", name: "Modul ABS", description: "Unitate hidraulică și electronică ABS/ESP.", price: 1980, stock: 3, serviceInterval: "Diagnostic anual" },
    ],
  },
  {
    id: "headlights",
    label: "Faruri",
    description: "Iluminare frontală, module LED și proiectoare.",
    components: [
      { id: "headlight-left", name: "Far stânga", description: "Bloc optic frontal stânga complet.", price: 1450, stock: 5, serviceInterval: "La defectare" },
      { id: "headlight-right", name: "Far dreapta", description: "Bloc optic frontal dreapta complet.", price: 1450, stock: 5, serviceInterval: "La defectare" },
      { id: "led-modules", name: "Module LED", description: "Set module de comandă și surse LED.", price: 690, stock: 12, serviceInterval: "La defectare" },
      { id: "fog-lights", name: "Proiectoare ceață", description: "Set proiectoare integrate în bara față.", price: 420, stock: 8, serviceInterval: "La defectare" },
    ],
  },
  {
    id: "trunk",
    label: "Portbagaj",
    description: "Caroserie posterioară, podea de încărcare și accesorii.",
    components: [
      { id: "trunk-lid", name: "Hayon", description: "Panou posterior complet cu balamale.", price: 1850, stock: 3, serviceInterval: "La deteriorare" },
      { id: "spare-wheel", name: "Roată de rezervă", description: "Roată compactă pentru intervenții temporare.", price: 540, stock: 10, serviceInterval: "Verificare anuală" },
      { id: "cargo-floor", name: "Podea portbagaj", description: "Panou rigid și compartiment inferior.", price: 280, stock: 13, serviceInterval: "La deteriorare" },
      { id: "rear-lights", name: "Stopuri spate", description: "Set optic LED stânga și dreapta.", price: 920, stock: 6, serviceInterval: "La defectare" },
    ],
  },
  {
    id: "battery",
    label: "Baterie",
    description: "Alimentare, protecție electrică și sistem de pornire.",
    components: [
      { id: "main-battery", name: "Baterie 12V", description: "Acumulator AGM de 70 Ah.", price: 420, stock: 12, serviceInterval: "4 ani" },
      { id: "battery-terminals", name: "Borne și cabluri", description: "Set borne, cablu masă și cablu pozitiv.", price: 160, stock: 18, serviceInterval: "Verificare anuală" },
      { id: "fuse-box", name: "Cutie siguranțe", description: "Distribuție și protecție pentru circuitele de putere.", price: 520, stock: 7, serviceInterval: "La defectare" },
      { id: "starter-motor", name: "Electromotor", description: "Motor electric pentru pornirea propulsorului.", price: 780, stock: 6, serviceInterval: "120.000 km" },
    ],
  },
  {
    id: "interior",
    label: "Interior",
    description: "Scaune, planșă de bord, direcție și consola centrală.",
    components: [
      { id: "front-seats", name: "Scaune față", description: "Set scaune ergonomice cu reglaj.", price: 2650, stock: 4, serviceInterval: "La deteriorare" },
      { id: "rear-bench", name: "Banchetă spate", description: "Banchetă rabatabilă cu trei locuri.", price: 1850, stock: 3, serviceInterval: "La deteriorare" },
      { id: "dashboard", name: "Planșă de bord", description: "Ansamblu bord, instrumentar și aeratoare.", price: 3400, stock: 2, serviceInterval: "La defectare" },
      { id: "steering-wheel", name: "Volan", description: "Volan multifuncțional cu modul de comandă.", price: 920, stock: 7, serviceInterval: "La deteriorare" },
      { id: "center-console", name: "Consolă centrală", description: "Comenzi, schimbător și spațiu de depozitare.", price: 1180, stock: 5, serviceInterval: "La deteriorare" },
    ],
  },
];

export function getVehicleZone(zoneId: VehicleZoneId) {
  return vehicleZones.find((zone) => zone.id === zoneId) ?? vehicleZones[0];
}
