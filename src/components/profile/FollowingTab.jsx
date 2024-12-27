import React, { useEffect, useState } from "react";
import ProfileHoverCard from "./ProfileHoverCard";
import apiClient from "../../utils/apiClient";

const FollowingTab = () => {
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 팔로우 목록 가져오기
  useEffect(() => {
    const fetchFollowing = async () => {
      try {
        const memberId = localStorage.getItem("memberId");
        const response = await apiClient.get("/follows/followees", {
          params: { followerId: memberId },
        });
        setFollowing(response.data.data || []);
      } catch (err) {
        setError("Failed to load following list. Please try again later.");
        console.error("Error fetching following list:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowing();
  }, []);

  // 팔로우 상태 토글
  const handleFollowToggle = async (memberId) => {
    try {
      await apiClient.post("/follows/toggle", {
        followeeId: memberId,
      });
      setFollowing((prev) =>
        prev.filter((follow) => follow.memberId !== memberId)
      );
      alert("팔로우 상태가 변경되었습니다.");
    } catch (err) {
      console.error("Failed to toggle follow:", err);
      alert("팔로우 상태 변경에 실패했습니다.");
    }
  };

  // 채팅방 생성
  const handleNewChat = async (targetMemberId) => {
    try {
      const memberId = localStorage.getItem("memberId");
      const response = await apiClient.post("/rooms", {
        memberId,
        targetMemberId,
      });
      alert(`채팅방이 생성되었습니다`);
    } catch (error) {
      console.error("채팅방 생성 중 오류 발생:", error);
      alert("채팅방 생성에 실패했습니다.");
    }
  };

  // 로딩 중
  if (loading) {
    return <div className="text-center mt-6">Loading following list...</div>;
  }

  // 오류 발생
  if (error) {
    return <div className="text-center mt-6 text-red-600">{error}</div>;
  }

  // 팔로우 목록이 비어있는 경우
  if (following.length === 0) {
    return (
      <div className="text-center mt-6 text-gray-600">
        팔로우 중인 사람이 없습니다.
      </div>
    );
  }

  // 팔로우 목록 렌더링
  return (
    <div className="text-left mt-6 space-y-4">
      <h3 className="text-xl font-semibold mb-4">내가 팔로우하는 사람들</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {following.map((follow) => (
          <div
            key={follow.memberId}
            className="relative group cursor-pointer"
          >
            {/* 프로필 기본 정보 */}
            <div className="flex items-center space-x-4 p-4 bg-white border rounded-lg">
              <ProfileHoverCard
                profileImage={follow.profileImage || "/default-avatar.png"}
                username={follow.nickname}
                nickname={follow.nickname || follow.username}
                targetMemberId={follow.memberId}
                onFollow={() => handleFollowToggle(follow.memberId)}
                onChat={() => handleNewChat(follow.memberId)}
              />
              <div>
                <p className="text-lg font-semibold">{follow.nickname}</p>
                <p className="text-sm text-gray-500">@{follow.username}</p>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default FollowingTab;
