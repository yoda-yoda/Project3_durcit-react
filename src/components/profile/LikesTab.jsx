import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import apiClient from "../../utils/apiClient";

const LikesTab = () => {
  const [likedPosts, setLikedPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLikedPosts = async () => {
      const memberId = localStorage.getItem("memberId");
      if (!memberId) {
        setError("Member ID not found in local storage.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await apiClient.get(`/likes/${memberId}`);
        setLikedPosts(response.data.data);
      } catch (err) {
        console.error("Failed to fetch liked posts:", err);
        setError("Failed to fetch liked posts. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLikedPosts();
  }, []);

  if (isLoading) {
    return <div className="text-center mt-6">Loading liked posts...</div>;
  }

  if (error) {
    return <div className="text-center mt-6 text-red-600">{error}</div>;
  }

  return (
    <div className="text-left mt-6 space-y-4">
      {likedPosts.length > 0 ? (
        likedPosts.map((post) => (
          <div
            key={post.id}
            className="p-4 border rounded shadow hover:bg-gray-50 cursor-pointer"
            onClick={() => navigate(`/posts/${post.id}`)}
          >
            <h3 className="text-lg font-bold">{post.title}</h3>
            <p className="text-sm text-gray-500">작성일: {post.createdAt}</p>
            <p className="text-sm text-gray-700 mt-2">{post.content}</p>
          </div>
        ))
      ) : (
        <p className="text-gray-600">좋아요를 누른 게시물이 없습니다 😥</p>
      )}
    </div>
  );
};

export default LikesTab;
