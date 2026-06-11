CREATE TABLE IF NOT EXISTS users_local (
    id BIGSERIAL PRIMARY KEY,
    keycloak_id VARCHAR(100) NOT NULL UNIQUE,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(180),
    role VARCHAR(30) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS car_brands (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS cars (
    id BIGSERIAL PRIMARY KEY,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year INTEGER NOT NULL,
    engine VARCHAR(100) NOT NULL,
    fuel_type VARCHAR(40)
);

CREATE TABLE IF NOT EXISTS user_cars (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT,
    car_id BIGINT REFERENCES cars(id),
    plate_number VARCHAR(20) NOT NULL,
    vin_optional VARCHAR(40),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vehicle_zones (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    model_3d_node_name VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS part_categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT
);

CREATE TABLE IF NOT EXISTS parts (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(180) NOT NULL,
    category_id BIGINT REFERENCES part_categories(id),
    zone_id BIGINT REFERENCES vehicle_zones(id),
    compatible_car_id BIGINT REFERENCES cars(id),
    description TEXT,
    price NUMERIC(12, 2) NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    uploaded_by_mechanic_id BIGINT,
    image_media_id BIGINT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS services (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(180) NOT NULL,
    type VARCHAR(50) NOT NULL,
    description TEXT,
    phone VARCHAR(40),
    email VARCHAR(180),
    rating NUMERIC(2, 1),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS service_locations (
    id BIGSERIAL PRIMARY KEY,
    service_id BIGINT NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL
);

CREATE TABLE IF NOT EXISTS service_parts (
    id BIGSERIAL PRIMARY KEY,
    service_id BIGINT NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    part_id BIGINT NOT NULL REFERENCES parts(id) ON DELETE CASCADE,
    stock INTEGER NOT NULL DEFAULT 0,
    price NUMERIC(12, 2)
);

CREATE TABLE IF NOT EXISTS appointments (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT,
    service_id BIGINT REFERENCES services(id),
    car_id BIGINT REFERENCES cars(id),
    part_id BIGINT REFERENCES parts(id),
    appointment_time TIMESTAMPTZ NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS road_assistance_requests (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT,
    assigned_service_id BIGINT REFERENCES services(id),
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    problem_description TEXT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'NEW',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS conversations (
    id BIGSERIAL PRIMARY KEY,
    service_id BIGINT REFERENCES services(id),
    user_id BIGINT,
    mechanic_id BIGINT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS messages (
    id BIGSERIAL PRIMARY KEY,
    conversation_id BIGINT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id BIGINT,
    content TEXT,
    message_type VARCHAR(30) NOT NULL DEFAULT 'TEXT',
    media_id BIGINT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS media_files (
    id BIGSERIAL PRIMARY KEY,
    original_file_name VARCHAR(255) NOT NULL,
    object_key VARCHAR(255) NOT NULL UNIQUE,
    bucket_name VARCHAR(100) NOT NULL,
    mime_type VARCHAR(120) NOT NULL,
    file_size BIGINT NOT NULL,
    uploaded_by VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

