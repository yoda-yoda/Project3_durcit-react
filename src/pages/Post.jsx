import React, { useState, useEffect } from "react";
import EmojiPicker from "emoji-picker-react"; // Importing the emoji-picker-react library
import { connectWebSocket, addEmoji, disconnectWebSocket } from "../utils/webSocket";
import "../styles/Post.css";

const Post = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Mock Data for posts
    const mockPosts = [
      { id: 1, title: "Post 1", content: "This is post 1", emojis: {} },
      { id: 2, title: "Post 2", content: "This is post 2", emojis: {} },
    ];
    setPosts(mockPosts);

    // WebSocket connection
    connectWebSocket((data) => {
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === data.postId ? { ...post, emojis: data.emojis } : post
        )
      );
    });

    return () => {
      disconnectWebSocket();
    };
  }, []);

  const handleAddEmoji = (postId, emoji) => {
    addEmoji(postId, emoji.emoji); // Using the emoji from emoji-picker-react
  };

  return (
    <div className="post-page">
      <h1>Posts</h1>
      <ul className="post-list">
        {posts.map((post) => (
          <PostItem key={post.id} post={post} onAddEmoji={handleAddEmoji} />
        ))}
      </ul>
    </div>
  );
};

const PostItem = ({ post, onAddEmoji }) => {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <li className="post-item">
      <div className="post-content">
        <h2>{post.title}</h2>
        <p>{post.content}</p>
      </div>
      <div className="emoji-bar">
        {Object.entries(post.emojis || {}).map(([emoji, count]) => (
          <span key={emoji} className="emoji">
            {emoji} {count > 1 && <span className="emoji-count">x{count}</span>}
          </span>
        ))}
        <button
          className="emoji-add-button"
          onClick={() => setShowPicker(!showPicker)}
        >
          ➕ Add Emoji
        </button>
      </div>
      {showPicker && (
        <div className="emoji-picker-container">
          <EmojiPicker
            onEmojiClick={(emoji) => {
              onAddEmoji(post.id, emoji);
              setShowPicker(false);
            }}
          />
        </div>
      )}
    </li>
  );
};

export default Post;
