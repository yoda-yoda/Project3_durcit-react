import React, { useEffect, useState } from "react";
import axios from "axios";
import MainFeedTopBar from "../components/MainFeedTopbar";
import { useNavigate } from "react-router-dom";

const MainFeed = () => {
  const [selectedOption, setSelectedOption] = useState("Best");
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 5;

  const navigate = useNavigate();

  // API 호출 함수
  const fetchPosts = async (page, category) => {
    console.log("Fetching posts for page:", page);
    try {
      const response = await axios.get("http://localhost:8080/api/posts/pages", {
        params: {
          page,
          size: PAGE_SIZE,
          category: category || "All",
        },
      });
      console.log(response.data);
      return response.data.data.content; // Spring Data Page 객체의 content
    } catch (error) {
      console.error("Error fetching posts:", error);
      return [];
    }
  };

  const loadMorePosts = async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);

    try {
      const newPosts = await fetchPosts(page, selectedOption); // 현재 페이지 요청
      if (newPosts.length > 0) {
        setPosts((prev) => {
          const mergedPosts = [...prev, ...newPosts];
          const uniquePosts = mergedPosts.filter(
            (post, index, self) => self.findIndex((p) => p.id === post.id) === index
          );
          return uniquePosts;
        });
        setPage((prevPage) => prevPage + 1); // 페이지 증가
        if (newPosts.length < PAGE_SIZE) {
          setHasMore(false); // 데이터가 더 이상 없으면 중단
        }
      } else {
        setHasMore(false); // 데이터가 더 이상 없으면 중단
      }
    } catch (error) {
      console.error("Error loading posts:", error);
    } finally {
      setIsLoading(false);
    }
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

  useEffect(() => {
    // 선택된 옵션이 변경되면 상태 초기화
    setPosts([]);
    setPage(0);
    setHasMore(true);
  }, [selectedOption]); // 선택 옵션이 변경될 때마다 실행

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

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
    setPosts([]); // 이전 게시물 초기화
    setPage(0); // 페이지 번호 초기화
    setHasMore(true); // 데이터 더 가져올 수 있음

    // 상태 초기화 후 데이터 요청
    setTimeout(() => {
      loadMorePosts();
    }, 0); // 비동기 상태 업데이트 후 실행
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

export default MainFeed;
