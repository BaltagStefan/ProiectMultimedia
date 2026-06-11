INSERT INTO car_brands(name) VALUES
    ('Volkswagen'), ('BMW'), ('Audi'), ('Dacia')
ON CONFLICT (name) DO NOTHING;

INSERT INTO cars(brand, model, year, engine, fuel_type) VALUES
    ('Volkswagen', 'Golf 7', 2017, '1.6 TDI', 'Diesel'),
    ('Volkswagen', 'Passat B8', 2019, '2.0 TDI', 'Diesel'),
    ('BMW', 'Seria 3', 2020, '2.0 TwinPower', 'Benzină'),
    ('Audi', 'A4', 2018, '2.0 TFSI', 'Benzină'),
    ('Dacia', 'Logan', 2021, '1.0 TCe', 'Benzină')
ON CONFLICT DO NOTHING;

INSERT INTO vehicle_zones(code, name, description, model_3d_node_name) VALUES
    ('hood', 'Capotă', 'Caroserie frontală și acces la motor', 'Hood'),
    ('engine', 'Motor', 'Propulsie, răcire și admisie', 'Engine'),
    ('wheels', 'Roți', 'Anvelope, jante și rulmenți', 'Wheels'),
    ('brakes', 'Frâne', 'Discuri, plăcuțe și etriere', 'Brakes'),
    ('headlights', 'Faruri', 'Iluminare frontală', 'Headlights'),
    ('trunk', 'Portbagaj', 'Caroserie și spațiu posterior', 'Trunk'),
    ('battery', 'Baterie', 'Alimentare electrică', 'Battery'),
    ('interior', 'Interior', 'Habitaclu și confort', 'Interior')
ON CONFLICT (code) DO NOTHING;

INSERT INTO part_categories(name, description) VALUES
    ('Motor', 'Componente motor'),
    ('Electric', 'Sistem electric'),
    ('Frânare', 'Sistem de frânare'),
    ('Caroserie', 'Elemente caroserie'),
    ('Filtre', 'Filtre și consumabile'),
    ('Iluminare', 'Faruri și becuri'),
    ('Suspensie', 'Suspensie și direcție')
ON CONFLICT (name) DO NOTHING;

INSERT INTO parts(name, category_id, zone_id, compatible_car_id, description, price, stock)
SELECT seed.name, category.id, zone.id, car.id, seed.description, seed.price, seed.stock
FROM (VALUES
    ('Baterie Bosch 70Ah', 'Electric', 'battery', 'Golf 7', 'Pornire sigură și tehnologie AGM.', 420.00, 12),
    ('Filtru aer premium', 'Filtre', 'engine', 'Golf 7', 'Debit optim și protecție pentru motor.', 89.00, 28),
    ('Filtru ulei', 'Filtre', 'engine', 'Passat B8', 'Filtrare de înaltă eficiență.', 54.00, 40),
    ('Alternator 180A', 'Electric', 'engine', 'Seria 3', 'Alternator recondiționat cu garanție.', 980.00, 4),
    ('Radiator răcire', 'Motor', 'engine', 'A4', 'Radiator aluminiu performant.', 760.00, 7),
    ('Plăcuțe frână față', 'Frânare', 'brakes', 'Golf 7', 'Set ceramic cu zgomot redus.', 285.00, 18),
    ('Disc frână ventilat', 'Frânare', 'brakes', 'Passat B8', 'Disc ventilat 312 mm.', 390.00, 15),
    ('Far stânga LED', 'Iluminare', 'headlights', 'A4', 'Far LED complet.', 1850.00, 2),
    ('Far dreapta LED', 'Iluminare', 'headlights', 'A4', 'Far LED complet.', 1850.00, 2),
    ('Amortizor față', 'Suspensie', 'wheels', 'Logan', 'Amortizor pe gaz.', 320.00, 11),
    ('Curea accesorii', 'Motor', 'engine', 'Golf 7', 'Curea EPDM rezistentă.', 145.00, 22)
) AS seed(name, category_name, zone_code, car_model, description, price, stock)
JOIN part_categories category ON category.name = seed.category_name
JOIN vehicle_zones zone ON zone.code = seed.zone_code
JOIN cars car ON car.model = seed.car_model
WHERE NOT EXISTS (SELECT 1 FROM parts existing WHERE existing.name = seed.name);

INSERT INTO services(name, type, description, phone, email, rating)
SELECT seed.name, seed.type, seed.description, seed.phone, seed.email, seed.rating
FROM (VALUES
    ('AutoTech Nord', 'PLATFORM_PARTNER', 'Diagnoză și mecanică generală', '021-555-0101', 'nord@autoassist.local', 4.8),
    ('Rapid ITP Colentina', 'RAR_ITP_MOCK', 'Stație ITP și verificări tehnice', '021-555-0102', 'itp@autoassist.local', 4.6),
    ('RoadHelp 24', 'ROAD_ASSISTANCE', 'Asistență rutieră non-stop', '0722-555-103', 'help@autoassist.local', 4.9),
    ('Garage Performance', 'PLATFORM_PARTNER', 'Service premium și tuning', '021-555-0104', 'garage@autoassist.local', 4.7),
    ('ITP Titan', 'RAR_ITP_MOCK', 'Inspecție tehnică rapidă', '021-555-0105', 'titan@autoassist.local', 4.5),
    ('Auto Electric Pro', 'PLATFORM_PARTNER', 'Electrică și diagnoză', '021-555-0106', 'electric@autoassist.local', 4.8),
    ('Platforma București', 'ROAD_ASSISTANCE', 'Tractări și depanare', '0722-555-107', 'platforma@autoassist.local', 4.7),
    ('West Side Motors', 'PLATFORM_PARTNER', 'Mecanică și caroserie', '021-555-0108', 'west@autoassist.local', 4.4),
    ('ITP Berceni', 'RAR_ITP_MOCK', 'ITP autoturisme', '021-555-0109', 'berceni@autoassist.local', 4.6),
    ('Green Auto Service', 'PLATFORM_PARTNER', 'Service multimarcă', '021-555-0110', 'green@autoassist.local', 4.9)
) AS seed(name, type, description, phone, email, rating)
WHERE NOT EXISTS (SELECT 1 FROM services existing WHERE existing.name = seed.name);

INSERT INTO service_locations(service_id, address, city, latitude, longitude)
SELECT service.id, seed.address, 'București', seed.latitude, seed.longitude
FROM (VALUES
    ('AutoTech Nord', 'Șoseaua Pipera 46', 44.4801, 26.1089),
    ('Rapid ITP Colentina', 'Șoseaua Colentina 318', 44.4629, 26.1541),
    ('RoadHelp 24', 'Bd. Timișoara 92', 44.4232, 26.0098),
    ('Garage Performance', 'Calea Floreasca 169', 44.4758, 26.1037),
    ('ITP Titan', 'Bd. 1 Decembrie 1918 33', 44.4208, 26.1747),
    ('Auto Electric Pro', 'Str. Viitorului 88', 44.4527, 26.1076),
    ('Platforma București', 'Șoseaua Giurgiului 288', 44.3751, 26.0908),
    ('West Side Motors', 'Bd. Iuliu Maniu 244', 44.4336, 25.9822),
    ('ITP Berceni', 'Șoseaua Berceni 104', 44.3748, 26.1357),
    ('Green Auto Service', 'Splaiul Unirii 450', 44.3987, 26.1732)
) AS seed(service_name, address, latitude, longitude)
JOIN services service ON service.name = seed.service_name
WHERE NOT EXISTS (
    SELECT 1 FROM service_locations location WHERE location.service_id = service.id
);

