import React, { useState } from "react";
import { apiClient } from "../../utils/apiClient";

const MentionsInput = ({ value, onChange, onAddMention }) => {
  const [mentionSuggestions, setMentionSuggestions] = useState([]);
  const [query, setQuery] = useState("");

  const fetchMentionSuggestions = async (query) => {
    try {
      // 서버에서 멘션 가능한 사용자 목록 가져오기
      const response = await apiClient.get(`/mentions?query=${query}`);
      setMentionSuggestions(response.data.data);
    } catch (error) {
      console.error("Failed to fetch mention suggestions:", error);
    }
  };

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    onChange(inputValue);

    // @로 시작하는 단어 감지 (한글 포함)
    const match = inputValue.match(/@([\w가-힣]*)$/);
    if (match) {
      const query = match[1];
      setQuery(query);
      fetchMentionSuggestions(query);
    } else {
      setQuery("");
      setMentionSuggestions([]);
    }
  };

  const handleAddMention = (mention) => {
    const newValue = value.replace(/@[\w가-힣]*$/, `@${mention.nickname} `);
    onChange(newValue);
    setMentionSuggestions([]);
    setQuery("");
    onAddMention(mention);
  };

  return (
    <div className="relative">
      <textarea
        value={value}
        onChange={handleInputChange}
        placeholder="Write your comment..."
        rows={3}
        className="w-full px-4 py-2 rounded shadow bg-gray-200 text-gray-700 resize-none"
      />
      {mentionSuggestions.length > 0 && (
        <div className="absolute bg-white shadow rounded mt-1 z-10 w-full">
          {mentionSuggestions.map((mention) => (
            <div
              key={mention.id}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100"
              onClick={() => handleAddMention(mention)}
            >
              <div className="flex items-center gap-2">
                <img
                  src={mention.profileImage || "/default-avatar.png"}
                  alt={mention.nickname}
                  className="w-8 h-8 rounded-full"
                />
                <span>@{mention.nickname}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MentionsInput;
