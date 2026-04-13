"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStudyPlacesFiltered = void 0;
exports.createStudyPlace = createStudyPlace;
exports.getStudyPlaceById = getStudyPlaceById;
exports.getStudyPlaces = getStudyPlaces;
const db_1 = require("../db/db");
async function createStudyPlace(data) {
    const result = await db_1.db.query(`INSERT INTO study_places
     (name, address, osm_id, lat, lon, verified, wifi_speed, noise_level, power_availability, place_type, working_hours)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
     RETURNING id, name, address, osm_id, lat, lon, verified, wifi_speed, noise_level, power_availability, place_type, working_hours, created_at`, [
        data.name,
        data.address,
        data.osmId,
        data.lat,
        data.lon,
        data.verified,
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
async function getStudyPlaceById(id) {
    const result = await db_1.db.query(`SELECT id, name, address, osm_id, lat, lon, verified, wifi_speed, noise_level, power_availability, place_type, working_hours, created_at
     FROM study_places
     WHERE id = $1`, [id]);
    return result.rows[0] ?? null;
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
const parseWorkingHoursRange = (workingHours) => {
    if (!workingHours)
        return null;
    const [startStr, endStr] = workingHours.split("-");
    const startHour = Number(startStr.split(":")[0]);
    const endHour = Number(endStr.split(":")[0]);
    if (Number.isNaN(startHour) || Number.isNaN(endHour)) {
        return null;
    }
    return {
        start: startHour,
        end: endHour,
    };
};
const workingHoursCategoryMatches = (workingHours, category) => {
    const range = parseWorkingHoursRange(workingHours);
    if (!range) {
        return false;
    }
    if (category === "morning") {
        return range.start < 12 && range.end > 6;
    }
    if (category === "afternoon") {
        return range.start < 18 && range.end > 12;
    }
    if (category === "evening") {
        return range.start < 24 && range.end > 18;
    }
    return false;
};
const isWorkingHoursCategory = (value) => value === "morning" || value === "afternoon" || value === "evening";
const getStudyPlacesFiltered = async (filters) => {
    let query = "SELECT * FROM study_places WHERE 1=1";
    const values = [];
    let index = 1;
    if (filters.wifiSpeed) {
        query += ` AND LOWER(wifi_speed) = LOWER($${index++})`;
        values.push(filters.wifiSpeed);
    }
    if (filters.noiseLevel) {
        query += ` AND LOWER(noise_level) = LOWER($${index++})`;
        values.push(filters.noiseLevel);
    }
    if (filters.powerAvailability) {
        query += ` AND LOWER(power_availability) = LOWER($${index++})`;
        values.push(filters.powerAvailability);
    }
    if (filters.placeType) {
        query += ` AND LOWER(place_type) = LOWER($${index++})`;
        values.push(filters.placeType);
    }
    if (filters.workingHours && !isWorkingHoursCategory(filters.workingHours)) {
        query += ` AND LOWER(working_hours) = LOWER($${index++})`;
        values.push(filters.workingHours);
    }
    const result = await db_1.db.query(query, values);
    const rows = result.rows;
    if (filters.workingHours && isWorkingHoursCategory(filters.workingHours)) {
        return rows.filter((row) => workingHoursCategoryMatches(row.working_hours ?? "", filters.workingHours));
    }
    return rows;
};
exports.getStudyPlacesFiltered = getStudyPlacesFiltered;
