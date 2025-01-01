import React, { useEffect, useState } from "react";
import MainFeedTopBar from "../components/MainFeedTopbar";
import useFetchPosts from "../hooks/useFetchPosts";
import { useNavigate } from "react-router-dom";
import PostCard from "../components/post/PostCard";

const MainFeed = () => {
  const { posts, isLoading, hasMore, loadMorePosts, setCategory } = useFetchPosts(
    "Best",
    "/api/posts/pages"
  );
  const [selectedOption, setSelectedOption] = useState("Best");
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

  // 카테고리 변경 핸들러
  const handleCategoryChange = (event) => {
    const newCategory = event.target.value;
    setSelectedOption(newCategory); // 선택된 옵션 상태 업데이트
    setCategory(newCategory); // useFetchPosts에서 카테고리 변경
  };

  return (
    <div>
      <MainFeedTopBar />
      <h1 className="text-2xl font-bold mb-4 mt-6">Welcome to the Game Community</h1>

      {/* 드롭다운 메뉴 */}
      <div className="mb-6">
        <select
          value={selectedOption}
          onChange={handleCategoryChange} // 수정된 부분
          className="p-2 bg-white rounded text-gray-700"
        >
          <option value="Best">Best</option>
          <option value="Hot">Hot</option>
          <option value="New">New</option>
        </select>
      </div>

      <div className="flex-1">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
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

export default MainFeed;
