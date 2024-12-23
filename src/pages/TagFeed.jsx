import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useFetchPosts from "../hooks/useFetchPosts";
import MainFeedTopBar from "../components/MainFeedTopbar";

const TagFeed = () => {
  const memberId = localStorage.getItem("memberId");
  const { posts, isLoading, hasMore, loadMorePosts, setCategory } = useFetchPosts(
    "Best",
    `http://localhost:8080/api/posts/pages/tags?memberId=${memberId}` // 태그 기반 API 엔드포인트
  );
  const navigate = useNavigate();

  useEffect(() => {
    // 초기 데이터 로드 및 스크롤 이벤트 등록
    loadMorePosts(); // 첫 페이지 데이터 로드

    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 100
      ) {
        loadMorePosts();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadMorePosts]); // loadMorePosts 함수에 의존

  return (
    <div>
      <MainFeedTopBar />
      <h1 className="text-2xl font-bold mb-4 mt-6">Posts from Followed Tags</h1>

      {/* 드롭다운 메뉴 */}
      <div className="mb-6">
        <select
          onChange={(e) => setCategory(e.target.value)}
          className="p-2 bg-white rounded text-gray-700"
        >
          <option value="Best">Best</option>
          <option value="Hot">Hot</option>
          <option value="New">New</option>
        </select>
      </div>

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

      {/* 로딩 UI */}
      {isLoading && (
        <div className="flex justify-center items-center my-6">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-500"></div>
        </div>
      )}

      {/* 더 이상 데이터가 없을 때 메시지 */}
      {!isLoading && !hasMore && (
        <div className="text-center text-gray-500 my-6">No more posts</div>
      )}
    </div>
  );
};

export default TagFeed;
