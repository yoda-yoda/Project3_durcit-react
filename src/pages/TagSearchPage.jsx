import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {apiClientNoAuth} from "../utils/apiClient";

const TagSearchPage = () => {
  const { tag } = useParams(); // URL에서 태그 가져오기
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const PAGE_SIZE = 10;

  const fetchPosts = async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const response = await apiClientNoAuth.get("/api/posts/search/tags", {
        params: { tag, page, size: PAGE_SIZE },
      });
      const newPosts = response.data.data.content;

      setPosts((prev) => [...prev, ...newPosts]);
      setPage((prev) => prev + 1);

      if (newPosts.length < PAGE_SIZE) setHasMore(false); // 더 이상 데이터가 없는 경우 처리
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 100
    ) {
      fetchPosts();
    }
  };

  useEffect(() => {
    // 페이지가 로드되었을 때 및 스크롤 이벤트 등록
    fetchPosts();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 mt-6">Posts tagged with #{tag}</h1>
      <div>
        {posts.map((post) => (
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
        ))}
      </div>

      {isLoading && (
        <div className="flex justify-center items-center my-6">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-500"></div>
        </div>
      )}

      {!isLoading && !hasMore && posts.length > 0 && (
        <div className="text-center text-gray-500 my-6">No more posts</div>
      )}
    </div>
  );
};

export default TagSearchPage;
