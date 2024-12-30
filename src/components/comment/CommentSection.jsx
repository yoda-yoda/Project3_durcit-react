import React, { useEffect, useState } from "react";
import ProfileHoverCard from "../profile/ProfileHoverCard";
import apiClient from "../../utils/apiClient"; // apiClient 임포트

const CommentSection = ({ comments, onReply }) => {
  const [commentTree, setCommentTree] = useState([]);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editContent, setEditContent] = useState("");

  const memberId = localStorage.getItem("memberId"); // 로컬 스토리지에서 memberId 가져오기

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

  const handleEdit = (comment) => {
    setEditingCommentId(comment.id);
    setEditContent(comment.content);
  };

  const handleDelete = async (commentId) => {
    try {
      await apiClient.delete(`/comments/${commentId}`);
      setCommentTree((prevTree) =>
        prevTree.filter((comment) => comment.id !== commentId)
      );
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleSave = async (commentId) => {
    try {
      const updatedComment = {
        id: commentId,
        content: editContent,
        authorId: comments.find((c) => c.id === commentId).authorId,
        mentions: [], // 필요에 따라 업데이트
      };
      await apiClient.put("/comments", updatedComment);
      setCommentTree((prevTree) =>
        prevTree.map((comment) =>
          comment.id === commentId
            ? { ...comment, content: editContent }
            : comment
        )
      );
      setEditingCommentId(null);
      setEditContent("");
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  const renderComments = (comments) => {
    return comments.map((comment) => (
      <div key={comment.id} className="mb-4">
        <div className="flex items-start mb-2 mr-1">
          <ProfileHoverCard
            profileImage={comment.userThumbnail || "/default-avatar.png"}
            username={comment.authorNickname}
            nickname={comment.authorNickname}
            targetMemberId={comment.authorId} // 댓글 작성자의 ID
          />
          <div>
            <div className="font-semibold ml-4">
              {comment.authorNickname}
            </div>
            {editingCommentId === comment.id ? (
              <div className="ml-4">
                <input
                  type="text"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="border rounded p-1"
                />
                <button
                  onClick={() => handleSave(comment.id)}
                  className="mt-2 text-sm text-blue-500 hover:underline"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingCommentId(null)}
                  className="mt-2 text-sm text-red-500 hover:underline ml-2"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <>
                <p className="text-gray-700 ml-4">{comment.content}</p>
                {comment.mentionList.length > 0 && (
                  <div className="text-sm text-gray-500 ml-4">
                    Mentions: {comment.mentionList.join(", ")}
                  </div>
                )}
                <button
                  onClick={() => onReply(comment.id)}
                  className="mt-2 text-sm text-blue-500 hover:underline ml-4"
                >
                  Reply
                </button>
                {comment.authorId.toString() === memberId && (
                  <>
                    <button
                      onClick={() => handleEdit(comment)}
                      className="mt-2 text-sm text-gray-600 hover:underline ml-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="mt-2 text-sm text-red-600 hover:underline ml-2"
                    >
                      Delete
                    </button>
                  </>
                )}
              </>
            )}
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
        <p className="text-gray-600">
          No comments yet. Be the first to comment!
        </p>
      )}
    </div>
  );
};

export default CommentSection;
