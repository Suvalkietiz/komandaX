import React from 'react';

export interface StudyPlace {
  id: string;
  name: string;
  address: string;
  description?: string;
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
        <div
          key={place.id}
          className="bg-white rounded shadow p-4 border hover:shadow-lg transition"
        >
          <h3 className="font-bold text-lg mb-2">{place.name}</h3>
          <p className="text-sm text-gray-600 mb-1">{place.address}</p>
          {place.description && (
            <p className="text-gray-700 text-sm mt-2">{place.description}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default ResultsList;
