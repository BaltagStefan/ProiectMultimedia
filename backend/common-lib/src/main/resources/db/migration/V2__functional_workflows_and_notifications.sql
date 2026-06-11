ALTER TABLE appointments ADD COLUMN IF NOT EXISTS user_subject VARCHAR(100);
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS requester_name VARCHAR(120);

ALTER TABLE road_assistance_requests ADD COLUMN IF NOT EXISTS user_subject VARCHAR(100);
ALTER TABLE road_assistance_requests ADD COLUMN IF NOT EXISTS requester_name VARCHAR(120);
ALTER TABLE road_assistance_requests ADD COLUMN IF NOT EXISTS problem_type VARCHAR(100);
ALTER TABLE road_assistance_requests ADD COLUMN IF NOT EXISTS media_id BIGINT;

ALTER TABLE conversations ADD COLUMN IF NOT EXISTS user_subject VARCHAR(100);
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS user_name VARCHAR(120);

ALTER TABLE messages ADD COLUMN IF NOT EXISTS sender_subject VARCHAR(100);
ALTER TABLE messages ADD COLUMN IF NOT EXISTS sender_name VARCHAR(120);
ALTER TABLE messages ADD COLUMN IF NOT EXISTS sender_role VARCHAR(30);

CREATE TABLE IF NOT EXISTS message_reads (
    message_id BIGINT NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
    reader_subject VARCHAR(100) NOT NULL,
    read_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (message_id, reader_subject)
);

CREATE TABLE IF NOT EXISTS notifications (
    id BIGSERIAL PRIMARY KEY,
    recipient_subject VARCHAR(100),
    recipient_role VARCHAR(30),
    type VARCHAR(40) NOT NULL,
    title VARCHAR(180) NOT NULL,
    message TEXT NOT NULL,
    entity_type VARCHAR(40),
    entity_id BIGINT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notification_reads (
    notification_id BIGINT NOT NULL REFERENCES notifications(id) ON DELETE CASCADE,
    reader_subject VARCHAR(100) NOT NULL,
    read_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (notification_id, reader_subject)
);

CREATE INDEX IF NOT EXISTS idx_appointments_user_subject ON appointments(user_subject);
CREATE INDEX IF NOT EXISTS idx_road_user_subject ON road_assistance_requests(user_subject);
CREATE INDEX IF NOT EXISTS idx_conversations_user_subject ON conversations(user_subject);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_created ON messages(conversation_id, created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON notifications(recipient_subject, recipient_role, created_at);
