"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAll = exports.create = void 0;
const studyPlacesService_1 = require("../services/studyPlacesService");
const create = async (req, res) => {
    const { wifiSpeed, noiseLevel, powerAvailability, placeType, workingHours } = req.body || {};
    if (!wifiSpeed ||
        !noiseLevel ||
        !powerAvailability ||
        !placeType ||
        !workingHours) {
        return res.status(400).json({ error: "All fields are required." });
    }
    try {
        const place = await (0, studyPlacesService_1.createStudyPlace)({
            wifiSpeed,
            noiseLevel,
            powerAvailability,
            placeType,
            workingHours
        });
        return res.status(201).json(place);
    }
    catch (error) {
        console.error("Error inserting study place", error);
        return res.status(500).json({ error: "Failed to save study place." });
    }
};
exports.create = create;
const getAll = async (_req, res) => {
    try {
        const places = await (0, studyPlacesService_1.getStudyPlaces)();
        return res.status(200).json(places);
    }
    catch (error) {
        console.error("Error fetching study places", error);
        return res.status(500).json({ error: "Failed to fetch study places." });
    }
};
exports.getAll = getAll;
