import { db } from "../db/db";

async function insertTestStudyPlace() {
  const result = await db.query(
    `INSERT INTO study_places
      (name, address, osm_id, lat, lon, verified, wifi_speed, noise_level, power_availability, place_type, working_hours, created_at)
    VALUES
      ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())
    RETURNING id`,
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
      "08:00-20:00"
    ]
  );
  console.log("Test study place inserted with id:", result.rows[0].id);

  const result2 = await db.query(
    `INSERT INTO study_places
      (name, address, osm_id, lat, lon, verified, wifi_speed, noise_level, power_availability, place_type, working_hours, created_at)
    VALUES
      ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())
    RETURNING id`,
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
      "00:00-24:00"
    ]
  );

  console.log("Test study place inserted with id:", result2.rows[0].id);

  const result3 = await db.query(
    `INSERT INTO study_places
      (name, address, osm_id, lat, lon, verified, wifi_speed, noise_level, power_availability, place_type, working_hours, created_at)
    VALUES
      ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())
    RETURNING id`,
    [
      "Study Cafe",
      "Gedimino pr. 13, Vilnius",
      "osm125",
      54.6872,
      25.2797,
      true,
      "Medium",
      "Medium", 
      "Sufficient",
      "cafe",
      "08:00-22:00"
    ]
  );

  console.log("Test study place inserted with id:", result3.rows[0].id);

  const result4 = await db.query(
    `INSERT INTO study_places
      (name, address, osm_id, lat, lon, verified, wifi_speed, noise_level, power_availability, place_type, working_hours, created_at)
    VALUES
      ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())
    RETURNING id`,
    [
      "Miesto skaitykla",
      "Gedimino pr. 43, Vilnius",
      "osm126",
      54.6895,
      25.2682,
      true,
      "Slow",
      "Loud", 
      "Insufficient",
      "other",
      "09:00-18:00"
    ]
  );

  console.log("Test study place inserted with id:", result4.rows[0].id);
  await db.end();
}

insertTestStudyPlace().catch(e => {
  console.error(e);
  db.end();
});
