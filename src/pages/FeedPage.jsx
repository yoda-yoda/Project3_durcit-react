import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import UserProfile from "../components/feed/UserProfile";

const FeedPage = () => {
  const [feedPosts, setFeedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeedPosts = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/feed/${userId}`);
        setFeedPosts(response.data.data);
      } catch (err) {
        setError("Failed to load feed. Please try again later.");
        console.error("Error fetching feed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedPosts();
  }, [userId]);

  const handlePostClick = (postId) => {
    navigate(`/posts/${postId}`);
  };

  if (loading) {
    return <div className="text-center mt-6">Loading feed...</div>;
  }

  if (error) {
    return <div className="text-center mt-6 text-red-600">{error}</div>;
  }

  return (
    <div className="space-y-6">
      {/* 사용자 정보 컴포넌트 */}
      <UserProfile userId={userId} />

      {/* 피드 포스트 리스트 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {feedPosts.length > 0 ? (
          feedPosts.map((post) => (
            <div
              key={post.id}
              className="relative cursor-pointer group"
              onClick={() => handlePostClick(post.id)}
            >
              <img
                src={post.postThumbnail || "/durcit-header-logo.png"} // 기본 이미지 경로 설정
                alt={post.title || "Default Image"}
                className="w-full h-48 object-cover rounded-lg shadow group-hover:opacity-75"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex flex-col justify-end p-4 rounded-lg">
                <h3 className="text-white text-lg font-bold">{post.title}</h3>
                <p className="text-sm text-gray-200">{post.createdAt}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600 col-span-full text-center">No posts to show 😥</p>
        )}
      </div>
    </div>
  );
};

export default FeedPage;
