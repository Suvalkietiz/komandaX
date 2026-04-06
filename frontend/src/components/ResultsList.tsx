import React from 'react';
import StudySpaceCard from './StudySpaceCard';

export interface StudyPlace {
  id: string | number;
  name: string;
  address: string;
  wifi_speed?: string;
  noise_level?: string;
  has_outlets?: boolean;
  distance?: number;
  distance_km?: number;
}

interface ResultsListProps {
  results: StudyPlace[];
}

const ResultsList: React.FC<ResultsListProps> = ({ results }) => {
  if (!results.length) {
    return (
      <div className="text-center text-gray-500 mt-8">
        Šioje vietoje studijų erdvių nerasta
      </div>
    );
  }

  return (
    <div className="grid gap-4 mt-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
      {results.map(place => (
        <StudySpaceCard
          key={place.id}
          id={place.id}
          name={place.name}
          address={place.address}
          wifi_speed={place.wifi_speed ?? 'Nežinoma'}
          noise_level={place.noise_level ?? 'Nežinomas'}
          has_outlets={place.has_outlets ?? false}
          distance_km={place.distance_km ?? place.distance ?? 0}
        />
      ))}
    </div>
  );
};

export default ResultsList;
