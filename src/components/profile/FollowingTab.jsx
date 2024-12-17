import React from "react";

const FollowingTab = () => {
  // 모킹 데이터
  const following = [
    { id: 1, name: "User3", profileImage: "/cute3.png" },
    { id: 2, name: "User4", profileImage: "/cute4.png" },
  ];

  return (
    <div className="text-left mt-6 space-y-4">
      <h3 className="text-xl font-semibold mb-4">내가 팔로우하는 사람들</h3>
      {following.map((follow) => (
        <div key={follow.id} className="flex items-center space-x-4 p-4 border rounded-lg">
          <img
            src={follow.profileImage}
            alt={follow.name}
            className="w-12 h-12 rounded-full"
          />
          <span className="text-lg font-medium">{follow.name}</span>
        </div>
      ))}
    </div>
  );
};

export default FollowingTab;
