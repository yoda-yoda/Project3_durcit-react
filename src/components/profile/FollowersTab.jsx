import React, { useEffect, useState } from "react";
import ProfileHoverCard from "./ProfileHoverCard";
import apiClient from "../../utils/apiClient";

const FollowersTab = () => {
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        const response = await apiClient.get("/follows/followers", {
          params: { followeeId: localStorage.getItem("memberId") }, // Replace with dynamic followeeId if needed
        });
        setFollowers(response.data.data);
      } catch (err) {
        setError("Failed to load followers. Please try again later.");
        console.error("Error fetching followers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowers();
  }, []);

  if (loading) {
    return <div className="text-center mt-6">Loading followers...</div>;
  }

  if (error) {
    return <div className="text-center mt-6 text-red-600">{error}</div>;
  }

  if (followers.length === 0) {
    return <div className="text-center mt-6 text-gray-600">팔로우 중인 사람이 없습니다.</div>;
  }

  return (
    <div className="text-left mt-6 space-y-4">
      <h3 className="text-xl font-semibold mb-4">나를 팔로우하는 사람들</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {followers.map((follower) => (
          <ProfileHoverCard
            key={follower.memberId}
            profileImage={follower.profileImage || "/default-avatar.png"}
            username={follower.username}
            nickname={follower.nickname || follower.username}
            onFollow={() => alert(`${follower.username}님을 팔로우했습니다.`)}
            onChat={() => alert(`${follower.username}님과 새 채팅을 시작합니다.`)}
          />
        ))}
      </div>
    </div>
  );
};

export default FollowersTab;