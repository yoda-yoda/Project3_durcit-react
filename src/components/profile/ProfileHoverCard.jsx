import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../utils/apiClient";

const ProfileHoverCard = ({ profileImage, username, nickname, onFollow, targetMemberId }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const navigate = useNavigate();

  const defaultImage = "/default-avatar.png"; // 대체 이미지 경로

  useEffect(() => {
    // 팔로우 상태 확인 API 호출
    const fetchFollowStatus = async () => {
      try {
        const response = await apiClient.get(`/follows`, {
          params: { followeeId: targetMemberId },
        });
        setIsFollowing(response.data.data); // API 응답에 따라 상태 설정
      } catch (error) {
        console.error("Failed to fetch follow status.", error);
      }
    };

    fetchFollowStatus();
  }, [targetMemberId]);

  const handleFollowToggle = async () => {
    try {
      await apiClient.post("/follows/toggle", { followeeId: targetMemberId });
      setIsFollowing(!isFollowing); // 상태를 토글
      alert(`팔로우 상태가 ${!isFollowing ? "팔로우" : "언팔로우"}로 변경되었습니다.`);
    } catch (error) {
      console.error("Failed to toggle follow.", error);
      alert("팔로우 상태 변경에 실패했습니다.");
    }
  };

  const handleNewChat = async () => {
    try {
      const response = await apiClient.post("/rooms", {
        memberId: localStorage.getItem("memberId"),
        targetMemberId: targetMemberId,
      });

      const chatRoom = response.data;
      alert(`채팅방이 생성되었습니다. Room ID: ${chatRoom.roomId}`);
    } catch (error) {
      console.error("채팅방 생성 중 오류 발생:", error);
      alert("채팅방 생성에 실패했습니다.");
    }
  };

  const handleNavigateToFeed = () => {
    navigate(`/users/${targetMemberId}`); // 유저 피드 페이지로 이동
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 프로필 이미지 */}
      <img
        src={profileImage || defaultImage}
        alt={username}
        className="w-12 h-12 rounded-full cursor-pointer"
        onClick={handleNavigateToFeed}
      />

      {/* 호버 시 표시될 카드 */}
      {isHovered && (
        <div className="absolute left-1/2 transform -translate-x-1/2 top-14 w-60 p-4 bg-white border rounded-lg shadow-lg z-10">
          {/* 유저 정보 */}
          <div className="flex items-center space-x-4 mb-4">
            <img
              src={profileImage || defaultImage}
              alt={username}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <h3 className="text-lg font-semibold">{nickname}</h3>
              <p className="text-gray-500 text-sm">@{username}</p>
            </div>
          </div>

          {/* 버튼들 */}
          <div className="flex justify-end space-x-2">
            <button
              onClick={handleFollowToggle}
              className={`px-4 py-2 text-white text-sm rounded transition ${
                isFollowing ? "bg-blue-500 hover:bg-blue-600" : "bg-red-500 hover:bg-red-600"
              }`}
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </button>
            <button
              onClick={handleNewChat}
              className="px-4 py-2 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 transition"
            >
              New Chat
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileHoverCard;
