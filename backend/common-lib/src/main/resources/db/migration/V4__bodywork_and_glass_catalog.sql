INSERT INTO vehicle_zones(code, name, description, model_3d_node_name) VALUES
    ('bodywork', 'Caroserie', 'Panouri exterioare, portiere, bare de protecție și plafon', 'Bodywork'),
    ('glass', 'Geamuri', 'Parbriz, lunetă și geamuri laterale', 'Glass')
ON CONFLICT (code) DO NOTHING;

INSERT INTO part_categories(name, description) VALUES
    ('Geamuri', 'Parbrize, lunete și geamuri laterale')
ON CONFLICT (name) DO NOTHING;
