import React, { useState, useEffect } from "react";
import apiClient from "../../utils/apiClient";
import axios from "axios";

const UserProfile = ({ userId }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);

  const defaultImage = "/default-avatar.png"; // 기본 이미지 경로
  const isLoggedIn = !!localStorage.getItem("memberId"); // 로그인 상태 확인

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/feeds/users/${userId}`);
        setUserInfo(response.data.data);

        // 로그인된 경우에만 팔로우 상태 확인
        if (isLoggedIn) {
          const followResponse = await apiClient.get(`/follows`, {
            params: { followeeId: userId },
          });
          setIsFollowing(followResponse.data.data);
        }
      } catch (err) {
        setError("Failed to load user info or follow status.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [userId, isLoggedIn]);

  const handleFollowToggle = async () => {
    if (!isLoggedIn) return;

    try {
      await apiClient.post("/follows/toggle", { followeeId: userId });
      setIsFollowing(!isFollowing);
      alert(`팔로우 상태가 ${!isFollowing ? "팔로우" : "언팔로우"}로 변경되었습니다.`);
    } catch (error) {
      console.error("Failed to toggle follow.", error);
      alert("팔로우 상태 변경에 실패했습니다.");
    }
  };

  const handleNewChat = async () => {
    if (!isLoggedIn) return;

    try {
      const response = await apiClient.post("/rooms", {
        memberId: localStorage.getItem("memberId"),
        targetMemberId: userId,
      });

      const chatRoom = response.data;
      alert(`채팅방이 생성되었습니다. Room ID: ${chatRoom.roomId}`);
    } catch (error) {
      console.error("채팅방 생성 중 오류 발생:", error);
      alert("채팅방 생성에 실패했습니다.");
    }
  };

  if (loading) {
    return <div className="text-center mt-4">Loading user info...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600 mt-4">{error}</div>;
  }

  const { userInfo: profile, bio, postCount, followerCount, followingCount } = userInfo;

  return (
    <div className="p-6 bg-white shadow rounded-lg max-w-4xl mx-auto">
      {/* 프로필 및 통계 정보 */}
      <div className="flex items-center justify-between">
        {/* 왼쪽: 프로필 정보 */}
        <div className="flex items-center space-x-6">
          <img
            src={profile.profileImage || defaultImage}
            alt={profile.nickname}
            className="w-20 h-20 rounded-full border border-gray-200"
          />
          <div>
            <h2 className="text-3xl font-bold">
              {profile.nickname}
              {/* 인증 마크 */}
              {profile.role === "manager" && (
                <span
                  className="ml-2 px-2 py-1 text-xs text-white bg-blue-500 rounded-full"
                  title="Manager Verified"
                >
                  인증됨
                </span>
              )}
            </h2>
            <p className="text-sm text-gray-500">@{profile.username}</p>
            <p className="text-gray-700 mt-2">{profile.bio || "This user has no bio yet."}</p>
          </div>
        </div>

        {/* 오른쪽: 통계 정보 */}
        <div className="flex space-x-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold">{postCount}</h3>
            <p className="text-sm text-gray-500">Posts</p>
          </div>
          <div className="text-center">
            <h3 className="text-2xl font-bold">{followerCount}</h3>
            <p className="text-sm text-gray-500">Followers</p>
          </div>
          <div className="text-center">
            <h3 className="text-2xl font-bold">{followingCount}</h3>
            <p className="text-sm text-gray-500">Following</p>
          </div>
        </div>
      </div>

      {/* 액션 버튼들 */}
      {isLoggedIn && (
        <div className="mt-6 flex justify-end space-x-4">
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
      )}
    </div>
  );
};

export default UserProfile;
