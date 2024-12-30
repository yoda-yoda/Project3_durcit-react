// PostCard.js
import React from "react";
import { useNavigate } from "react-router-dom";

const PostCard = ({ post }) => {
  const navigate = useNavigate();

  return (
    <div
      key={post.id}
      className="mb-6 p-4 bg-white rounded shadow hover:bg-gray-100 transition flex items-center"
      onClick={() => navigate(`/posts/${post.id}`)}
    >
      {/* 왼쪽: 작성자 정보와 텍스트 */}
      <div className="flex-1">
        <div className="flex items-center mb-4">
          <img
            src={post.userThumbnail || "https://via.placeholder.com/50"}
            alt={`${post.author} profile`}
            className="w-10 h-10 rounded-full mr-3"
          />
          <div>
            <div className="font-semibold">{post.author}</div>
            <div className="text-gray-500 text-sm">{post.createdAt}</div>
          </div>
        </div>
        <h2 className="text-lg font-semibold">{post.title}</h2>
        <p className="text-gray-700 truncate">{post.content}</p>
        <div className="flex items-center text-gray-500 text-sm mt-2">
          <span className="mr-4">{post.views} views</span>
          <span>{post.commentCount} comments</span>
        </div>
      </div>

      {/* 오른쪽: 썸네일 */}
      {post.postThumbnail && (
        <img
          src={post.postThumbnail}
          alt={`${post.title} thumbnail`}
          className="w-48 h-36 rounded ml-4 object-cover"
        />
      )}
    </div>
  );
};

export default PostCard;
