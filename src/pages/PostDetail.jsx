import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import EmojiPicker from "emoji-picker-react";
import {
  connectWebSocket,
  addEmoji,
  disconnectWebSocket,
  connectWebSocketEmoji,
} from "../utils/webSocket";
import apiClient from "../utils/apiClient";
import { checkAuth } from "../utils/authUtils";
import ProfileHoverCard from "../components/profile/ProfileHoverCard";
import CommentSection from "../components/comment/CommentSection";
import MentionsInput from "../components/comment/MentionsInput";

const PostDetail = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [likes, setLikes] = useState(0);
  const [reactions, setReactions] = useState({});
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const [isAddingComment, setIsAddingComment] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [selectedMentions, setSelectedMentions] = useState([]);
  const [parentId, setParentId] = useState(null);

  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [tags, setTags] = useState([]);
  const navigate = useNavigate(); // useNavigate 훅 추가

  useEffect(() => {
    // Fetch post details
    fetchPostDetails();

    // Connect WebSocket
    connectWebSocketEmoji(handleEmojiUpdate, postId);

    return () => {
      disconnectWebSocket();
    };
  }, [postId]);

  const handleAddMention = (mention) => {
    setSelectedMentions((prev) => [...prev, mention]);
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const mentions = selectedMentions.map((mention) => mention.nickname);

      const response = await apiClient.post("/comments", {
        content: newComment,
        postId: postId,
        mentionList: mentions,
        parentId: parentId,
      });

      if (response.status === 200) {
        setNewComment("");
        setSelectedMentions([]);
        // Fetch updated comments logic here
      }
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  const fetchPostDetails = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/posts/${postId}`);
      const data = await response.json();
      setPost(data.data);
      setTags(data.data.tags);
      setLikes(data.data.post.likes);
      setReactions(
        data.data.emojis.emojis.reduce((acc, emoji) => {
          acc[emoji.emoji] = emoji.count;
          return acc;
        }, {})
      );
    } catch (error) {
      console.error("Failed to fetch post details:", error);
    }
  };

  const handleEditClick = () => {
    // 게시물 데이터를 EditPost로 전달
    navigate(`/posts/edit/${postId}`, { state: { post } });
  };

  const handleEmojiUpdate = (updatedEmoji) => {
    const { emojis } = updatedEmoji;

    // 서버에서 받은 새로운 상태로 reactions 업데이트
    if (!emojis || emojis.length === 0) {
      setReactions({});
      return;
    }

    // 새로운 이모지 상태 적용
    const newReactions = emojis.reduce((acc, { emoji, count }) => {
      acc[emoji] = count;
      return acc;
    }, {});

    setReactions(newReactions);
  };

  const handleLike = async () => {
    if (!checkAuth()) return;

    try {
      // POST 요청으로 좋아요 상태 토글
      const response = await apiClient.post(`/likes/${postId}/toggle`);

      if (!response.data) {
        throw new Error("Failed to toggle like");
      }

      // 데이터 다시 로드
      await fetchPostDetails();
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleReaction = (emoji) => {
    if (!checkAuth()) return;
    if (!emoji) {
      console.error("Cannot add reaction: Emoji is undefined!");
      return;
    }
    addEmoji(postId, emoji);
  };

  const onEmojiClick = (emojiObject) => {
    console.log("Selected Emoji Object:", emojiObject);
    if (emojiObject && emojiObject.emoji) {
      const emoji = emojiObject.emoji;
      console.log("Emoji to send:", emoji);
      handleReaction(emoji);
    } else {
      console.error("Failed to retrieve emoji from picker");
    }
    setShowEmojiPicker(false);
  };

  const handleCancelComment = () => {
    setIsAddingComment(false);
    setNewComment("");
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen p-6">
      {/* Post Content */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <div className="relative">
          <div className="absolute top-2 right-2">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="text-gray-500 hover:text-gray-700"
            >
              &#8942;
            </button>
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-32 bg-white shadow-lg rounded">
                <button
                  onClick={() => alert("Update clicked")}
                  className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                >
                  Update
                </button>
                <button
                  onClick={() => alert("Delete clicked")}
                  className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                >
                  Delete
                </button>
                <button
                  onClick={handleEditClick}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                >
                  Edit
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center mb-4">
            <ProfileHoverCard
              profileImage={post.post.userThumbnail}
              username={post.post.author}
              nickname={post.post.author}
              targetMemberId={post.post.authorId}
              onFollow={() => alert(`Followed ${post.post.author}`)}
              onChat={() => alert(`Started chat with ${post.post.author}`)}
            />
            <div className="ml-4">
              <h1 className="text-xl font-semibold">{post.post.title}</h1>
              <div className="text-gray-500 text-sm">
                By {post.post.author} • {post.post.createdAt}
              </div>
            </div>
          </div>
          <div className="mt-4">
            {
              post.uploads.length > 0 ? (
                post.uploads.length > 1 ? (
                  // 슬라이더로 여러 이미지 표시
                  <Slider {...sliderSettings}>
                    {post.uploads.map((image, index) => (
                      <div key={`${image.url}-${index}`}>
                        <img
                          src={image.url}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-auto rounded"
                        />
                      </div>
                    ))}
                  </Slider>
                ) : (
                  // 단일 이미지 표시
                  <div>
                    <img
                      src={post.uploads[0]?.url}
                      alt="Post upload"
                      className="w-full h-auto rounded"
                    />
                  </div>
                )
              ) : null /* 이미지가 없을 경우 아무것도 렌더링하지 않음 */
            }
          </div>
          <p className="text-gray-700">{post.post.content}</p>
        </div>

        {/* 태그 섹션 */}
        {tags.length > 0 && (
          <div className="mt-4">
            <strong>Tags</strong>
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag) => (
                <span
                  key={tag.id}
                  className="px-2 py-1 bg-gray-200 rounded-full text-gray-700 font-semibold text-sm"
                >
                  #{tag.contents}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center gap-4 mt-4">
          <button
            onClick={handleLike}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300"
          >
            ⬆ <span>{likes ?? "좋아요"}</span>
          </button>

          {Object.entries(reactions).map(([emoji, count]) => (
            <button
              key={emoji}
              onClick={() => handleReaction(emoji)}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300"
            >
              {emoji} {count}
            </button>
          ))}
        </div>

        <div className="mt-4">
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="w-36 h-12 flex items-center justify-center rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300"
          >
            + Add a Reaction
          </button>
          {showEmojiPicker && (
            <div className="mt-2">
              <EmojiPicker onEmojiClick={onEmojiClick} />
            </div>
          )}
        </div>
      </div>

      {/* Add Comment Section */}
      <div className="mb-4">
        <MentionsInput
          value={newComment}
          onChange={setNewComment}
          onAddMention={(mention) =>
            setSelectedMentions((prev) => [...prev, mention])
          }
        />
        <div className="flex justify-between items-center mt-2 gap-4">
          <button
            onClick={() => {
              setNewComment("");
              setSelectedMentions([]);
              setParentId(null);
            }}
            className="px-4 py-2 text-gray-700 rounded shadow hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleAddComment}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded shadow hover:bg-gray-300"
          >
            {parentId ? "Reply" : "Comment"}
          </button>
        </div>
      </div>

      {/* Comments Section */}
      <CommentSection
        comments={post.comments || []}
        onReply={(id) => setParentId(id)}
      />
    </div>
  );
};

export default PostDetail;
