import { useState, useEffect } from "react";
import {apiClientNoAuth} from "../utils/apiClient";

const useFetchPosts = (initialCategory, endpoint) => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [category, setCategory] = useState(initialCategory);
  const PAGE_SIZE = 5;

  const fetchPosts = async (currentPage, currentCategory) => {
    try {
      const response = await apiClientNoAuth.get(endpoint, {
        params: {
          page: currentPage,
          size: PAGE_SIZE,
          category: currentCategory,
        },
      });
      return response.data.data.content;
    } catch (error) {
      console.error("Error fetching posts:", error);
      return [];
    }
  };

  const loadMorePosts = async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const newPosts = await fetchPosts(page, category);
      if (newPosts.length > 0) {
        setPosts((prevPosts) => {
          const mergedPosts = [...prevPosts, ...newPosts];
          const uniquePosts = mergedPosts.filter(
            (post, index, self) => self.findIndex((p) => p.id === post.id) === index
          );
          return uniquePosts;
        });
        setPage((prevPage) => prevPage + 1);
        if (newPosts.length < PAGE_SIZE) {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading more posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setPosts([]);
    setPage(0);
    setHasMore(true);
  }, [category]);

  return {
    posts,
    isLoading,
    hasMore,
    loadMorePosts,
    setCategory,
  };
};

export default useFetchPosts;
