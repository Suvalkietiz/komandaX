import { db } from "../db/db";

async function insertTestStudyPlace() {
  const seedPlaces = [
    [
      "Testinė biblioteka",
      "Testo g. 1, Vilnius",
      "osm123",
      54.6872,
      25.2797,
      true,
      "Greitas",
      "Tylu",
      "Yra",
      "library",
      "08:00-20:00",
    ],
    [
      "VILNIUS TECH biblioteka",
      "Saulėtekio al. 11, Vilnius",
      "osm124",
      54.7223,
      25.3376,
      true,
      "Fast",
      "Low",
      "Sufficient",
      "library",
      "00:00-24:00",
    ],
    [
      "Study Cafe",
      "Gedimino pr. 13, Vilnius",
      "osm125",
      54.6872,
      25.2797,
      true,
      "Fast",
      "Medium",
      "Sufficient",
      "cafe",
      "08:00-22:00",
    ],
    [
      "Miesto skaitykla",
      "Gedimino pr. 43, Vilnius",
      "osm126",
      54.6895,
      25.2682,
      true,
      "Slow",
      "High",
      "Insufficient",
      "other",
      "09:00-18:00",
    ],
  ] as const;

  for (const place of seedPlaces) {
    const result = await db.query(
      `INSERT INTO study_places
        (name, address, osm_id, lat, lon, verified, wifi_speed, noise_level, power_availability, place_type, working_hours, created_at)
      VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())
      ON CONFLICT (osm_id)
      DO UPDATE SET
        name = EXCLUDED.name,
        address = EXCLUDED.address,
        lat = EXCLUDED.lat,
        lon = EXCLUDED.lon,
        verified = EXCLUDED.verified,
        wifi_speed = EXCLUDED.wifi_speed,
        noise_level = EXCLUDED.noise_level,
        power_availability = EXCLUDED.power_availability,
        place_type = EXCLUDED.place_type,
        working_hours = EXCLUDED.working_hours
      RETURNING id`,
      [...place]
    );

    console.log("Test study place upserted with id:", result.rows[0].id);
  }

  await db.end();
}

insertTestStudyPlace().catch(e => {
  console.error(e);
  db.end();
});
