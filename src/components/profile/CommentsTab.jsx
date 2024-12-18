import React from "react";

const CommentsTab = () => {
  // 모킹 데이터
  const comments = [
    { id: 1, content: "좋은 글이네요!", post: "첫 번째 게시글" },
    { id: 2, content: "유익한 정보 감사합니다.", post: "React로 UI 구현 중입니다." },
  ];

  return (
    <div className="text-left mt-6 space-y-4">
      {comments.length > 0 ? (
        comments.map((comment) => (
          <div
            key={comment.id}
            className="p-4 border rounded shadow hover:bg-gray-50"
          >
            <p className="text-gray-800">{comment.content}</p>
            <p className="text-sm text-gray-500">댓글 작성 글: {comment.post}</p>
          </div>
        ))
      ) : (
        <p className="text-gray-600">작성된 댓글이 없습니다 😥</p>
      )}
    </div>
  );
};

export default CommentsTab;
