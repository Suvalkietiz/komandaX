"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFiltered = exports.getById = exports.getAll = exports.create = void 0;
const studyPlacesService_1 = require("../services/studyPlacesService");
const osmValidationService_1 = require("../services/osmValidationService");
const create = async (req, res) => {
    const { name, address, wifiSpeed, noiseLevel, powerAvailability, placeType, workingHours } = req.body || {};
    if (!name ||
        !address ||
        !wifiSpeed ||
        !noiseLevel ||
        !powerAvailability ||
        !placeType ||
        !workingHours) {
        return res.status(400).json({ error: "All fields are required." });
    }
    try {
        const { osmId, lat, lon } = await (0, osmValidationService_1.validatePublicStudyPlace)(address);
        const place = await (0, studyPlacesService_1.createStudyPlace)({
            name,
            address,
            osmId,
            lat,
            lon,
            verified: true,
            wifiSpeed,
            noiseLevel,
            powerAvailability,
            placeType,
            workingHours
        });
        return res.status(201).json(place);
    }
    catch (error) {
        if (error instanceof Error && error.message === osmValidationService_1.PUBLIC_STUDY_PLACE_ERROR) {
            return res.status(400).json({ error: osmValidationService_1.PUBLIC_STUDY_PLACE_ERROR });
        }
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
const getById = async (req, res) => {
    const { id } = req.params;
    const placeId = Number(id);
    if (!Number.isInteger(placeId) || placeId <= 0) {
        return res.status(400).json({ error: "Invalid place id." });
    }
    try {
        const place = await (0, studyPlacesService_1.getStudyPlaceById)(placeId);
        if (!place) {
            return res.status(404).json({ error: "Study place not found." });
        }
        return res.status(200).json(place);
    }
    catch (error) {
        console.error("Error fetching study place by id", error);
        return res.status(500).json({ error: "Failed to fetch study place." });
    }
};
exports.getById = getById;
const getFiltered = async (req, res) => {
    const { wifiSpeed, noiseLevel, powerAvailability, placeType, workingHours, } = req.query;
    try {
        const places = await (0, studyPlacesService_1.getStudyPlacesFiltered)({
            wifiSpeed: wifiSpeed,
            noiseLevel: noiseLevel,
            powerAvailability: powerAvailability,
            placeType: placeType,
            workingHours: workingHours,
        });
        return res.status(200).json(places);
    }
    catch (error) {
        console.error("Error filtering study places", error);
        return res.status(500).json({ error: "Failed to filter study places." });
    }
};
exports.getFiltered = getFiltered;
