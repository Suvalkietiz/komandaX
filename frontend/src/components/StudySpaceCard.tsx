import React from 'react';

import { useNavigate } from "react-router-dom";

interface StudySpaceCardProps {
  id: string | number;
  name: string;
  address: string;
  wifi_speed: string;
  noise_level: string;
  has_outlets: boolean;
  distance_km: number;
}

const StudySpaceCard: React.FC<StudySpaceCardProps> = ({
  id,
  name,
  address,
  wifi_speed,
  noise_level,
  has_outlets,
  distance_km,
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded shadow p-4 border flex flex-col gap-2 min-w-[250px]">
      <h3 className="font-bold text-lg">{name}</h3>
      <p className="text-gray-600 text-sm">{address}</p>
      <div className="flex flex-wrap gap-3 mt-2 text-sm">
        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">WiFi: {wifi_speed}</span>
        <span className="bg-green-100 text-green-800 px-2 py-1 rounded">Triukšmas: {noise_level}</span>
        <span className={`px-2 py-1 rounded ${has_outlets ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-500'}`}>
          {has_outlets ? 'Yra rozetės' : 'Nėra rozečių'}
        </span>
      </div>
      <div className="mt-2 text-right text-xs text-gray-500">
        Atstumas: {distance_km.toFixed(1)} km
      </div>
      <button
        type="button"
        onClick={() => navigate(`/study-place/${id}`)}
        className="mt-3 rounded bg-blue-600 text-white px-3 py-2 text-sm hover:bg-blue-700"
      >
        Informacija
      </button>
    </div>
  );
};

export default StudySpaceCard;
