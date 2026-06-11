const path = require("path");
const fs = require("fs");

const root = path.resolve(__dirname, "..");
const logs = path.join(root, "logs", "pm2");

function loadEnv(file) {
  if (!fs.existsSync(file)) return {};
  return Object.fromEntries(
    fs.readFileSync(file, "utf8")
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#") && line.includes("="))
      .map((line) => {
        const separator = line.indexOf("=");
        return [line.slice(0, separator), line.slice(separator + 1)];
      }),
  );
}

const services = [
  ["api-gateway", "api-gateway", 8088],
  ["auth-profile-service", "auth-profile-service", 8091],
  ["vehicle-service", "vehicle-service", 8092],
  ["parts-service", "parts-service", 8093],
  ["service-locator-service", "service-locator-service", 8094],
  ["appointment-service", "appointment-service", 8095],
  ["chat-service", "chat-service", 8096],
  ["media-service", "media-service", 8097],
  ["road-assistance-service", "road-assistance-service", 8098],
];

module.exports = {
  apps: services.map(([name, jar, port]) => ({
    name: `autoassist-${name}`,
    cwd: root,
    script: "java",
    args: `-jar backend/${name}/target/${jar}.jar`,
    interpreter: "none",
    autorestart: true,
    max_restarts: 10,
    restart_delay: 3000,
    env: {
      DATABASE_URL: "jdbc:postgresql://localhost:5432/autoassist",
      DATABASE_USERNAME: "autoassist",
      DATABASE_PASSWORD: "autoassist",
      KEYCLOAK_ISSUER_URI: "http://localhost:8080/realms/autoassist",
      MINIO_URL: "http://localhost:9000",
      MINIO_ACCESS_KEY: "minioadmin",
      MINIO_SECRET_KEY: "minioadmin",
      MINIO_BUCKET: "autoassist-media",
      SERVER_PORT: String(port),
      ...loadEnv(path.join(root, "config", "env", "backend", `${name}.env`)),
    },
    out_file: path.join(logs, `${name}.out.log`),
    error_file: path.join(logs, `${name}.error.log`),
    merge_logs: true,
    time: true,
  })),
};
