import React, { useEffect, useState } from "react";
import ProfileHoverCard from "./ProfileHoverCard";
import apiClient from "../../utils/apiClient";

const FollowersTab = () => {
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 팔로워 목록 가져오기
  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        const memberId = localStorage.getItem("memberId");
        const response = await apiClient.get("/follows/followers", {
          params: { followeeId: memberId },
        });
        setFollowers(response.data.data || []);
      } catch (err) {
        setError("Failed to load followers list. Please try again later.");
        console.error("Error fetching followers list:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowers();
  }, []);

  // 채팅방 생성
  const handleNewChat = async (targetMemberId) => {
    try {
      const memberId = localStorage.getItem("memberId");
      await apiClient.post("/rooms", {
        memberId,
        targetMemberId,
      });
      alert("채팅방이 생성되었습니다.");
    } catch (error) {
      console.error("채팅방 생성 중 오류 발생:", error);
      alert("채팅방 생성에 실패했습니다.");
    }
  };

  // 로딩 중
  if (loading) {
    return <div className="text-center mt-6">Loading followers list...</div>;
  }

  // 오류 발생
  if (error) {
    return <div className="text-center mt-6 text-red-600">{error}</div>;
  }

  // 팔로워 목록이 비어있는 경우
  if (followers.length === 0) {
    return (
      <div className="text-center mt-6 text-gray-600">
        나를 팔로우하는 사람이 없습니다.
      </div>
    );
  }

  // 팔로워 목록 렌더링
  return (
    <div className="text-left mt-6 space-y-4">
      <h3 className="text-xl font-semibold mb-4">나를 팔로우하는 사람들</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {followers.map((follower) => (
          <div
            key={follower.memberId}
            className="relative group cursor-pointer"
          >
            {/* 프로필 기본 정보 */}
            <div className="flex items-center space-x-4 p-4 bg-white border rounded-lg">
              <ProfileHoverCard
                profileImage={follower.profileImage || "/default-avatar.png"}
                username={follower.nickname}
                nickname={follower.nickname || follower.username}
                targetMemberId={follower.memberId}
                onFollow={() => alert(`${follower.nickname}님을 팔로우했습니다.`)}
                onChat={() => handleNewChat(follower.memberId)}
              />
              <div>
                <p className="text-lg font-semibold">{follower.nickname}</p>
                <p className="text-sm text-gray-500">@{follower.username}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FollowersTab;
