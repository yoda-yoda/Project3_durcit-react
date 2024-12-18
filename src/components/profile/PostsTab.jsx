import React from "react";

const PostsTab = () => {
  // 모킹 데이터
  const posts = [
    { id: 1, title: "첫 번째 게시글입니다.", date: "2024-12-01" },
    { id: 2, title: "React로 UI 구현 중입니다.", date: "2024-12-02" },
  ];

  return (
    <div className="text-left mt-6 space-y-4">
      {posts.length > 0 ? (
        posts.map((post) => (
          <div
            key={post.id}
            className="p-4 border rounded shadow hover:bg-gray-50 cursor-pointer"
          >
            <h3 className="text-lg font-bold">{post.title}</h3>
            <p className="text-sm text-gray-500">작성일: {post.date}</p>
          </div>
        ))
      ) : (
        <p className="text-gray-600">작성된 게시물이 없습니다 😥</p>
      )}
    </div>
  );
};

export default PostsTab;
