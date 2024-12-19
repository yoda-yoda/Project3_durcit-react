import React, { useEffect, useState } from "react";
import ProfileHoverCard from "./ProfileHoverCard";
import apiClient from "../../utils/apiClient";

const FollowingTab = () => {
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFollowing = async () => {
      try {
        const response = await apiClient.get("/follows/followees", {
          params: { followerId: localStorage.getItem("memberId") }, // Replace with dynamic followerId if needed
        });
        setFollowing(response.data.data);
      } catch (err) {
        setError("Failed to load following list. Please try again later.");
        console.error("Error fetching following list:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowing();
  }, []);

  if (loading) {
    return <div className="text-center mt-6">Loading following list...</div>;
  }

  if (error) {
    return <div className="text-center mt-6 text-red-600">{error}</div>;
  }

  if (following.length === 0) {
    return <div className="text-center mt-6 text-gray-600">팔로우 중인 사람이 없습니다.</div>;
  }

  return (
    <div className="text-left mt-6 space-y-4">
      <h3 className="text-xl font-semibold mb-4">내가 팔로우하는 사람들</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {following.map((follow) => (
          <ProfileHoverCard
            key={follow.memberId}
            profileImage={follow.profileImage || "/default-avatar.png"}
            username={follow.username}
            nickname={follow.nickname || follow.username}
            onFollow={() => alert(`${follow.username}님을 팔로우 취소했습니다.`)}
            onChat={() => alert(`${follow.username}님과 새 채팅을 시작합니다.`)}
          />
        ))}
      </div>
    </div>
  );
};

export default FollowingTab;