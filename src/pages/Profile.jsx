import React from "react";

const UserProfile = () => {
    return (
        <div className="bg-white py-10 px-6">
            {/* 프로필 정보 */}
            <div className="flex items-center space-x-4">
                <img
                    src="/cute1.png"
                    alt="User Avatar"
                    className="w-24 h-24 rounded-full shadow-md"
                />
                <div className="text-left">
                    <h2 className="text-3xl font-bold text-gray-800">DURCIT8567</h2>
                    <p className="text-gray-500 text-sm">u/DURCIT8567</p>
                </div>
            </div>

            {/* 탭 메뉴 */}
            <div className="mt-6 border-b">
                <ul className="flex space-x-6 text-gray-600 font-medium">
                    <li className="border-b-2 border-blue-500 text-blue-500 pb-2 text-lg">
                        Overview
                    </li>
                    <li className="hover:text-blue-500 cursor-pointer">Posts</li>
                    <li className="hover:text-blue-500 cursor-pointer">Comments</li>
                    <li className="hover:text-blue-500 cursor-pointer">Saved</li>
                    <li className="hover:text-blue-500 cursor-pointer">Hidden</li>
                    <li className="hover:text-blue-500 cursor-pointer">Upvoted</li>
                    <li className="hover:text-blue-500 cursor-pointer">Downvoted</li>
                </ul>
            </div>

            {/* 게시물 상태 */}
            <div className="text-left mt-16">
                <img
                    src="/cute.png"
                    alt="No posts"
                    className="w-32 mb-4"
                />
                <p className="text-lg font-medium mt-4 text-gray-600">
                    작성된 게시물이 없습니다 😥
                </p>
            </div>
        </div>
    );
};

export default UserProfile;
