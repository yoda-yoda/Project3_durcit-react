import React, { useEffect, useState } from "react";

const CommentSection = ({ comments, onReply }) => {
  const [commentTree, setCommentTree] = useState([]);

  useEffect(() => {
    const buildCommentTree = (comments) => {
      const commentMap = new Map();

      // 초기화: 모든 댓글을 맵에 저장하고 children 배열 추가
      comments.forEach((comment) => {
        comment.children = [];
        commentMap.set(comment.id, comment);
      });

      const roots = [];

      // 부모-자식 관계 설정
      comments.forEach((comment) => {
        if (comment.parentId) {
          const parent = commentMap.get(comment.parentId);
          if (parent) {
            parent.children.push(comment);
          }
        } else {
          roots.push(comment); // 부모 댓글
        }
      });

      return roots;
    };

    const tree = buildCommentTree(comments);
    setCommentTree(tree);
  }, [comments]);

  const renderComments = (comments) => {
    return comments.map((comment) => (
      <div key={comment.id} className="mb-4">
        <div className="flex items-start mb-2">
          <img
            src={comment.userThumbnail || "/default-avatar.png"}
            alt={comment.authorNickname}
            className="w-10 h-10 rounded-full mr-3"
          />
          <div>
            <div className="font-semibold">{comment.authorNickname}</div>
            <p className="text-gray-700">{comment.content}</p>
            {comment.mentionList.length > 0 && (
              <div className="text-sm text-gray-500">
                Mentions: {comment.mentionList.join(", ")}
              </div>
            )}
            <button
              onClick={() => onReply(comment.id)}
              className="mt-2 text-sm text-blue-500 hover:underline"
            >
              Reply
            </button>
          </div>
        </div>
        {comment.children.length > 0 && (
          <div className="ml-10 border-l pl-4">
            {renderComments(comment.children)}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-4">Comments</h2>
      {commentTree.length > 0 ? (
        renderComments(commentTree)
      ) : (
        <p className="text-gray-600">No comments yet. Be the first to comment!</p>
      )}
    </div>
  );
};

export default CommentSection;
