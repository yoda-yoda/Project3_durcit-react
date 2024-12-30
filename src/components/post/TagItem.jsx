import React from "react";
import apiClient from "../../utils/apiClient";

const TagItem = ({ tag, onToggleSuccess }) => {
  const handleToggleFollow = async () => {
    const memberId = localStorage.getItem("memberId");
    try {
      // 태그 팔로우 토글 API 호출
      const response = await apiClient.post(`/tag-follow/${memberId}/post`, {
        tag: tag.contents,
      });

      // 성공 시 상태 업데이트
      if (response.status === 200) {
        onToggleSuccess(tag.id, response.data.data.isFollowing);
      }
    } catch (error) {
      console.error("Failed to toggle follow status:", error);
    }
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-sm font-semibold cursor-pointer ${
        tag.isFollowing ? "bg-blue-100 text-blue-600" : "bg-gray-200 text-gray-700"
      }`}
      onClick={handleToggleFollow}
    >
      #{tag.contents}
    </span>
  );
};

export default TagItem;