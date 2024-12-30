import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiSearch } from "react-icons/fi";

const SearchBar = ({ placeholder = "Search Durcit" }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  const fetchSearchResults = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await axios.get(`/sp/api/search`, {
        params: { query },
      });
      setSearchResults(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch search results:", error);
    }
  };

  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setIsSearching(true);
    fetchSearchResults(query);
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      navigate(`/search?query=${searchQuery}`);
      setSearchResults([]);
      setSearchQuery("");
    }
  };

  const handleSearchItemClick = (item) => {
    if (item.type === "post") navigate(`/posts/${item.id}`);
    if (item.type === "user") navigate(`/users/${item.id}`);
    if (item.type === "tag") navigate(`/search/tags/${item.name}`);
  };

  return (
    <div className="relative flex-1">
      <input
        type="text"
        placeholder={placeholder}
        value={searchQuery}
        onChange={handleInputChange}
        className="w-full px-4 py-2 border rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-600 text-gray-500"
      />
      {isSearching && searchResults.length > 0 && (
        <div className="absolute left-0 right-0 bg-white border rounded shadow-lg z-10 max-h-60 overflow-y-auto">
          {searchResults.map((result) => (
            <div
              key={result.id}
              onClick={() => handleSearchItemClick(result)}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100"
            >
              {result.type === "post" && <span>📄 {result.name}</span>}
              {result.type === "user" && <span>👤 {result.name}</span>}
              {result.type === "tag" && <span>🏷️ #{result.name}</span>}
            </div>
          ))}
        </div>
      )}
      <button
        onClick={handleSearchSubmit}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
      >
        <FiSearch size={20} /> {/* 돋보기 아이콘 */}
      </button>
    </div>
);
};

export default SearchBar;
