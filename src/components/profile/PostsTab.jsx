import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate import
import apiClient from "../../utils/apiClient";

const PostsTab = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // useNavigate 초기화

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await apiClient.get("/my-posts");
        setPosts(response.data.data);
      } catch (err) {
        setError("Failed to load posts. Please try again later.");
        console.error("Error fetching posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handlePostClick = (postId) => {
    navigate(`/posts/${postId}`); // 특정 포스트 ID로 이동
  };

  if (loading) {
    return <div className="text-center mt-6">Loading posts...</div>;
  }

  if (error) {
    return <div className="text-center mt-6 text-red-600">{error}</div>;
  }

  return (
    <div className="text-left mt-6 space-y-4">
      {posts.length > 0 ? (
        posts.map((post) => (
          <div
            key={post.id}
            className="p-4 border rounded shadow hover:bg-gray-50 cursor-pointer"
            onClick={() => handlePostClick(post.id)} // 클릭 이벤트 추가
          >
            <h3 className="text-lg font-bold">{post.title}</h3>
            <p className="text-sm text-gray-500">작성일: {post.createdAt}</p>
            <p className="text-sm text-gray-700 mt-2">{post.content}</p>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-sm text-gray-500">조회수: {post.views}</span>
              <span className="text-sm text-gray-500">좋아요: {post.likeCount}</span>
              <span className="text-sm text-gray-500">댓글: {post.commentCount}</span>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-600">작성된 게시물이 없습니다 😥</p>
      )}
    </div>
  );
};

export default PostsTab;
