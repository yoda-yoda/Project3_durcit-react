import React, {useEffect, useState} from "react";
import MainFeedTopBar from "../components/MainFeedTopbar";
import { useNavigate } from "react-router-dom";

const MainFeed = () => {
  const [selectedOption, setSelectedOption] = useState("Best");
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 5; // 한 번에 가져올 게시물 개수

  const navigate = useNavigate();

  // 더미 데이터 생성 (실제로는 API 요청)
  const mockFetchPosts = (page) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newPosts = Array.from({ length: PAGE_SIZE }, (_, index) => {
          const id = (page - 1) * PAGE_SIZE + index + 1;
          setPage(page + 1);
          return {
            id,
            author: {
              name: `Author ${id}`,
              profileImage: "https://via.placeholder.com/50",
            },
            createdAt: `${id} hours ago`,
            title: `Post Title ${id}`,
            content: `Post content ${id}`,
            views: id * 10,
            comments: id * 5,
            thumbnail: id % 2 === 0 ? "https://via.placeholder.com/150" : null,
          };
        });
        resolve(newPosts);
      }, 1000); // 1초 딜레이
    });
  };

  // 데이터 로드 함수
  const loadMorePosts = async () => {
    if (isLoading || !hasMore) return; // 로딩 중이거나 더 가져올 데이터가 없으면 중단
    setIsLoading(true);

    const newPosts = await mockFetchPosts(page);

    if (newPosts.length > 0) {
      setPosts((prev) => [...prev, ...newPosts]);
      setPage((prev) => prev + 1);
    } else {
      setHasMore(false); // 더 이상 데이터가 없음을 표시
    }

    setIsLoading(false);
  };

  // 스크롤 이벤트 핸들러
  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 100
    ) {
      loadMorePosts();
    }
  };

  // 컴포넌트 마운트 시 스크롤 이벤트 등록
  useEffect(() => {
    loadMorePosts(); // 첫 페이지 데이터 로드
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <div>
      <MainFeedTopBar />
      <h1 className="text-2xl font-bold mb-4 mt-6">Welcome to the Game Community</h1>

      {/* 드롭다운 메뉴 */}
      <div className="mb-6">
        <select
          value={selectedOption}
          onChange={handleSelectChange}
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
                  src={post.author.profileImage}
                  alt={`${post.author.name} profile`}
                  className="w-10 h-10 rounded-full mr-3"
                />
                <div>
                  <div className="font-semibold">{post.author.name}</div>
                  <div className="text-gray-500 text-sm">{post.createdAt}</div>
                </div>
              </div>
              <h2 className="text-lg font-semibold">{post.title}</h2>
              <p className="text-gray-700 truncate">{post.content}</p>
              <div className="flex items-center text-gray-500 text-sm mt-2">
                <span className="mr-4">{post.views} views</span>
                <span>{post.comments} comments</span>
              </div>
            </div>

            {/* 오른쪽: 썸네일 */}
            {post.thumbnail && (
              <img
                src={post.thumbnail}
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

export default MainFeed;
