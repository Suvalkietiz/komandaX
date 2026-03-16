import React, { useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => Promise<void>;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onSearch(query);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSearch} className="flex items-center gap-2">
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Ieškoti studijų vietos..."
        className="border rounded px-3 py-2 focus:outline-none focus:ring w-full"
        disabled={loading}
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        disabled={loading}
      >
        {loading ? 'Ieškoma...' : 'Ieškoti'}
      </button>
    </form>
  );
};

export default SearchBar;
