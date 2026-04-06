"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStudyPlace = createStudyPlace;
exports.getStudyPlaces = getStudyPlaces;
const db_1 = require("../db/db");
async function createStudyPlace(data) {
    const result = await db_1.db.query(`INSERT INTO study_places
     (wifi_speed, noise_level, power_availability, place_type, working_hours)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, wifi_speed, noise_level, power_availability, place_type, working_hours, created_at`, [
        data.wifiSpeed,
        data.noiseLevel,
        data.powerAvailability,
        data.placeType,
        data.workingHours
    ]);
    return result.rows[0];
}
function toBooleanOutlets(value) {
    if (!value) {
        return false;
    }
    const normalized = value.toLowerCase();
    return normalized.includes("yes") || normalized.includes("yra") || normalized.includes("true");
}
async function getStudyPlaces() {
    const result = await db_1.db.query(`SELECT
       id,
       name,
       address,
       lat,
       lon,
       verified,
       wifi_speed,
       noise_level,
       power_availability,
       place_type
     FROM study_places
     WHERE verified = TRUE
       AND lat IS NOT NULL
       AND lon IS NOT NULL
     ORDER BY created_at DESC`);
    return result.rows.map((row) => ({
        id: String(row.id),
        name: row.name ?? row.place_type ?? `Study place #${row.id}`,
        address: row.address ?? "Adresas nenurodytas",
        lat: row.lat ?? null,
        lon: row.lon ?? null,
        verified: row.verified ?? false,
        wifi_speed: row.wifi_speed ?? "Nežinoma",
        noise_level: row.noise_level ?? "Nežinomas",
        has_outlets: toBooleanOutlets(row.power_availability),
    }));
}
