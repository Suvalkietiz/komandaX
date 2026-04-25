import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

interface StudyPlaceDetailData {
  id: number;
  wifi_speed: string;
  noise_level: string;
  power_availability: string;
  place_type: string;
  working_hours: string;
  created_at: string;
  name?: string;
  address?: string;
  description?: string;
  rating?: number;
  photo_url?: string;
  review_count?: number;
}


const mockDataMap: Record<number, Partial<StudyPlaceDetailData>> = {
  1: {
    id: 1,
    name: "VILNIUS TECH biblioteka",
    address: "Saulėtekio al. 11, Vilnius",
    description:
      "Modernizuota VILNIUS TECH universiteto biblioteka su erdviais studijų kambariais, galingu WiFi ir šilta atmosfera.",
    rating: 4.8,
    photo_url: "https://images.unsplash.com/photo-150784272343-583f20270319?w=800",
    wifi_speed: "Greitas",
    noise_level: "Žemas",
    power_availability: "Pakankamas",
    place_type: "Biblioteka",
    working_hours: "7:00 - 23:00",
    review_count: 324,
  },
  2: {
    id: 2,
    name: "Study Cafe",
    address: "Didžioji g. 28, Vilnius",
    description:
      "Šiuolaikiška kavinė su patogiom kėdėm, skania kava ir patogiais studijų kampeliais. Draugiškas personalas.",
    rating: 4.5,
    photo_url: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800",
    wifi_speed: "Normalus",
    noise_level: "Vidutinis",
    power_availability: "Pakankamas",
    place_type: "Kavinė",
    working_hours: "8:00 - 22:00",
    review_count: 156,
  },
  3: {
    id: 3,
    name: "Miesto skaitykla",
    address: "Vokiečių g. 2, Vilnius",
    description:
      "Klasikinė senamiesty skaitykla su tylia atmosfera ir geru WiFi. Puiki vieta ramiam darbui.",
    rating: 4.6,
    photo_url: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800",
    wifi_speed: "Greitas",
    noise_level: "Žemas",
    power_availability: "Ribotas",
    place_type: "Skaitykla",
    working_hours: "9:00 - 19:00",
    review_count: 89,
  },
};

export function StudyPlaceDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [place, setPlace] = useState<StudyPlaceDetailData | null>(null);

  useEffect(() => {
    const fetchPlace = async () => {
      if (!id) return;

      const placeId = parseInt(id, 10);
      if (isNaN(placeId)) return;

      try {
     
        const response = await fetch(`/api/study-places/${placeId}`);
        if (response.ok) {
          const apiData = await response.json();
          const mockData = mockDataMap[placeId] || {};
          // Combine API data with mock for display fields
          const combinedData: StudyPlaceDetailData = {
            ...mockData,
            ...apiData,
          } as StudyPlaceDetailData;
          setPlace(combinedData);
        } else {
          
          const placeData = mockDataMap[placeId];
          setPlace(placeData as StudyPlaceDetailData || null);
        }
      } catch (error) {
        console.error("Error fetching study place:", error);
       
        const placeData = mockDataMap[placeId];
        setPlace(placeData as StudyPlaceDetailData || null);
      }
    };

    fetchPlace();
  }, [id]);

  if (!place) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <button
          onClick={() => navigate("/")}
          className="mb-4 text-blue-600 hover:underline"
        >
          ← Grįžti atgal
        </button>
        <p className="text-gray-500">Vieta nerasta</p>
      </div>
    );
  }

  const getColorClass = (level: string) => {
    const lower = level.toLowerCase();
    if (lower.includes("žemas") || lower.includes("greitas") || lower.includes("pakankamas")) {
      return "bg-green-100 text-green-800";
    }
    if (lower.includes("vidutinis") || lower.includes("normalus")) {
      return "bg-yellow-100 text-yellow-800";
    }
    if (lower.includes("aukštas") || lower.includes("lėtas") || lower.includes("ribotas")) {
      return "bg-red-100 text-red-800";
    }
    return "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4">
        <button
          onClick={() => navigate("/")}
          className="mb-6 text-blue-600 hover:underline font-medium"
        >
          ← Grįžti atgal
        </button>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {}
          <div className="w-full h-96 overflow-hidden">
            <img
              src={place.photo_url}
              alt={place.name}
              className="w-full h-full object-cover"
            />
          </div>

          {}
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-2">{place.name}</h1>
            <p className="text-gray-600 text-lg mb-4">{place.address}</p>

            {}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-yellow-500">★</span>
                <span className="text-2xl font-bold">{place.rating}</span>
                <span className="text-gray-600">({place.review_count} atsiliepimai)</span>
              </div>
            </div>

            {}
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-3">Aprašymas</h2>
              <p className="text-gray-700 leading-relaxed">{place.description}</p>
            </div>

            {}
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Charakteristikos</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-700 mb-2">Vietos tipas</h3>
                  <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {place.place_type}
                  </span>
                </div>

                {}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-700 mb-2">WiFi greitis</h3>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm ${getColorClass(place.wifi_speed)}`}>
                    {place.wifi_speed}
                  </span>
                </div>

                {}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-700 mb-2">Triukšmo lygis</h3>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm ${getColorClass(place.noise_level)}`}>
                    {place.noise_level}
                  </span>
                </div>

                {}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-700 mb-2">El. lizdų kiekis</h3>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm ${getColorClass(place.power_availability)}`}>
                    {place.power_availability}
                  </span>
                </div>

                {}
                <div className="bg-gray-50 p-4 rounded-lg md:col-span-2">
                  <h3 className="font-semibold text-gray-700 mb-2">Darbo valandos</h3>
                  <p className="text-gray-900 font-medium">{place.working_hours}</p>
                </div>
              </div>
            </div>

            {}
            <div className="border-t pt-6">
              <button
                onClick={() => navigate("/")}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Grįžti į žemėlapį
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
