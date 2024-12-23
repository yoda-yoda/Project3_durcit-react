import React, { useEffect, useState } from "react";
import apiClient from "../../utils/apiClient";

const FollowingTagsTab = () => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFollowingTags = async () => {
      try {
        const memberId = localStorage.getItem("memberId");
        const response = await apiClient.get(`/tag-follow/${memberId}`);
        setTags(response.data.data);
      } catch (err) {
        console.error("Failed to load following tags:", err);
        setError("Failed to load following tags. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchFollowingTags();
  }, []);

  const handleUnfollow = async (tagId) => {
    try {
      const memberId = localStorage.getItem("memberId");
      await apiClient.post(`/tag-follow/${memberId}/post`, {
        tag: tagId,
      });
      // 태그를 리스트에서 제거
      setTags((prevTags) => prevTags.filter((tag) => tag.id !== tagId));
      alert("Successfully unfollowed the tag.");
    } catch (error) {
      console.error("Failed to unfollow tag:", error);
      alert("Failed to unfollow the tag. Please try again.");
    }
  };

  if (loading) {
    return <div className="text-center mt-6">Loading tags...</div>;
  }

  if (error) {
    return <div className="text-center mt-6 text-red-600">{error}</div>;
  }

  return (
    <div className="text-left mt-6 space-y-4">
      {tags.length > 0 ? (
        tags.map((tag) => (
          <div
            key={tag.id}
            className="p-2 border rounded shadow flex justify-between items-center hover:bg-gray-50"
          >
            <span className="text-gray-800 font-semibold">#{tag.tag}</span>
            <button
              onClick={() => handleUnfollow(tag.id)}
              className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
            >
              Unfollow
            </button>
          </div>
        ))
      ) : (
        <p className="text-gray-600">You are not following any tags yet 😥</p>
      )}
    </div>
  );
};

export default FollowingTagsTab;
