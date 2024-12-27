import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate import
import apiClient from "../../utils/apiClient";

const CommentsTab = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // useNavigate 초기화

  useEffect(() => {
    const fetchComments = async () => {
      const memberId = localStorage.getItem("memberId"); // 로컬 스토리지에서 멤버 ID 가져오기

      if (!memberId) {
        setError("Member ID not found in local storage.");
        setLoading(false);
        return;
      }

      try {
        // API 호출
        const response = await apiClient.get(`/my-comments/${memberId}`);
        setComments(response.data.data); // API에서 받은 댓글 데이터 설정
      } catch (err) {
        setError("Failed to load comments. Please try again later.");
        console.error("Error fetching comments:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, []);

  const handleCommentClick = (postId) => {
    navigate(`/posts/${postId}`); // 해당 포스트로 이동
  };

  if (loading) {
    return <div className="text-center mt-6">Loading comments...</div>;
  }

  if (error) {
    return <div className="text-center mt-6 text-red-600">{error}</div>;
  }

  return (
    <div className="text-left mt-6 space-y-4">
      {comments.length > 0 ? (
        comments.map((comment) => (
          <div
            key={comment.id}
            className="p-4 border rounded shadow hover:bg-gray-50 cursor-pointer"
            onClick={() => handleCommentClick(comment.postId)} // 댓글 클릭 이벤트 추가
          >
            <p className="text-gray-800">{comment.content}</p>
            <p className="text-sm text-gray-500">
              작성 글 ID: {comment.postId}
            </p>
            <p className="text-sm text-gray-400">
              작성 시간: {comment.createdAt}
            </p>
          </div>
        ))
      ) : (
        <p className="text-gray-600">작성된 댓글이 없습니다 😥</p>
      )}
    </div>
  );
};

export default CommentsTab;
