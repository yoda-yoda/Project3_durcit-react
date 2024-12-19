import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import EmojiPicker from "emoji-picker-react";
import { connectWebSocket, addEmoji, disconnectWebSocket } from "../utils/webSocket";
import apiClient from "../utils/apiClient";

const PostDetail = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [likes, setLikes] = useState(0);
  const [reactions, setReactions] = useState({});
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [mentions, setMentions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState(null);

  useEffect(() => {
    // Fetch post details
    fetchPostDetails();

    // Connect WebSocket
    connectWebSocket(handleEmojiUpdate);

    return () => {
      disconnectWebSocket();
    };
  }, [postId]);

  const fetchPostDetails = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/posts/${postId}`);
      const data = await response.json();
      setPost(data.data);
      setLikes(data.data.post.likes);
      setReactions(data.data.emojis.emojis.reduce((acc, emoji) => {
        acc[emoji.emoji] = emoji.count;
        return acc;
      }, {}));
    } catch (error) {
      console.error("Failed to fetch post details:", error);
    }
  };


  const handleEmojiUpdate = (updatedEmoji) => {
    const { emojis } = updatedEmoji;

    if (!emojis || emojis.length === 0) {
      // 이모지가 없는 경우 reactions를 초기화
      setReactions({});
      return;
    }

    // 서버에서 전달된 최신 이모지 데이터를 기반으로 reactions를 업데이트
    const newReactions = emojis.reduce((acc, emoji) => {
      acc[emoji.emoji] = emoji.count;
      return acc;
    }, {});

    setReactions(newReactions);
  };



  const handleLike = async () => {
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

  const handleAddComment = () => {
    alert(`Comment added: ${newComment}`);
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
              </div>
            )}
          </div>

          <div className="flex items-center mb-4">
            <img
              src={post.post.userThumbnail}
              alt={post.post.author}
              className="w-12 h-12 rounded-full mr-3"
            />
            <div>
              <h1 className="text-xl font-semibold">{post.post.title}</h1>
              <div className="text-gray-500 text-sm">
                By {post.post.author} • {post.post.createdAt}
              </div>
            </div>
          </div>
          <div className="mt-4">
            {post.uploads.length > 1 ? (
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
            )}
          </div>
          <p className="text-gray-700">{post.post.content}</p>
        </div>


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
              <EmojiPicker onEmojiClick={onEmojiClick}/>
            </div>
          )}
        </div>
      </div>

      <div className="mb-4">
        {isAddingComment ? (
          <div className="relative">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write your comment..."
              rows={2}
              className="w-full px-4 py-2 rounded-full shadow bg-gray-200 text-gray-700 resize-none"
            />
            <div className="flex justify-between items-center mt-2 gap-4">
              <button
                onClick={handleCancelComment}
                className="px-4 py-2 text-gray-700 rounded-full shadow hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleAddComment}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full shadow hover:bg-gray-300"
              >
                Comment
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsAddingComment(true)}
            className="flex items-center px-4 py-2 text-gray-800 bg-white rounded-full shadow hover:bg-gray-200"
          >
            + Add a Comment
          </button>
        )}
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-4">Comments</h2>
        {/*{post.comments.map((comment) => (*/}
        {/*  <div key={comment.id} className="mb-4">*/}
        {/*    <div className="flex items-start mb-2">*/}
        {/*      <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>*/}
        {/*      <div>*/}
        {/*        <div className="font-semibold">{comment.author}</div>*/}
        {/*        <p className="text-gray-700">{comment.content}</p>*/}
        {/*      </div>*/}
        {/*    </div>*/}
        {/*    {comment.replies.map((reply) => (*/}
        {/*      <div key={reply.id} className="ml-12 mt-2">*/}
        {/*        <div className="flex items-start">*/}
        {/*          <div className="w-8 h-8 bg-gray-200 rounded-full mr-3"></div>*/}
        {/*          <div>*/}
        {/*            <div className="font-semibold">{reply.author}</div>*/}
        {/*            <p className="text-gray-700">{reply.content}</p>*/}
        {/*          </div>*/}
        {/*        </div>*/}
        {/*      </div>*/}
        {/*    ))}*/}
        {/*  </div>*/}
        {/*))}*/}
      </div>
    </div>
  );
};

export default PostDetail;
