import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import EmojiPicker from "emoji-picker-react";

const mockPostData = {
  id: 1,
  title: "Welcome to the Game Community",
  content:
    "This is a detailed description of the post. Here you can discuss and share your thoughts about the game community.",
  author: { name: "John Doe", profileImage: "https://via.placeholder.com/50" },
  createdAt: "2 hours ago",
  tags: ["Game", "Community", "Fun"],
  likes: 120,
  reactions: { "👍": 10, "❤️": 5, "😂": 3, "😢": 2 },
  comments: [
    {
      id: 1,
      author: "Jane Smith",
      content: "This is a comment.",
      replies: [
        {
          id: 2,
          author: "Alex Johnson",
          content: "This is a reply to the comment.",
        },
      ],
    },
    {
      id: 3,
      author: "Emily Davis",
      content: "Another comment here.",
      replies: [],
    },
  ],
};

const PostDetail = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [likes, setLikes] = useState(0);
  const [reactions, setReactions] = useState({});
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isAddingComment, setIsAddingComment] = useState(false); // To toggle input box
  const [newComment, setNewComment] = useState(""); // To capture comment text
  const [mentions, setMentions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);


  useEffect(() => {
    // Simulate fetching post data
    setTimeout(() => {
      setPost(mockPostData);
      setLikes(mockPostData.likes);
      setReactions(mockPostData.reactions);
    }, 500);
  }, [postId]);

  const handleUpdate = () => {
    alert("Update post clicked"); // Replace with actual update logic
    setShowDropdown(false); // Close dropdown
  };

  const handleDelete = () => {
    alert("Delete post clicked"); // Replace with actual delete logic
    setShowDropdown(false); // Close dropdown
  };

  const handleLike = () => {
    setLikes((prevLikes) => prevLikes + 1);
  };

  const handleReaction = (emoji) => {
    setReactions((prevReactions) => ({
      ...prevReactions,
      [emoji]: (prevReactions[emoji] || 0) + 1,
    }));
  };

  const onEmojiClick = (event, emojiObject) => {
    const emoji = emojiObject.emoji;
    handleReaction(emoji);
    setShowEmojiPicker(false); // Close the picker after selecting an emoji
  };

  const handleCancelComment = () => {
    setIsAddingComment(false); // Hide input box
    setNewComment(""); // Clear input field
  };

  const handleAddComment = () => {
    alert(`Comment added: ${newComment}`); // Simulate adding comment
    setIsAddingComment(false); // Hide input box
    setNewComment(""); // Clear input field
  };

  const handleRemoveMention = (index) => {
    setMentions((prevMentions) =>
      prevMentions.filter((_, i) => i !== index) // Keep all mentions except the clicked one
    );
  };

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen p-6">
      {/* Post Content */}
      <div className="bg-white p-4 rounded shadow mb-6">
        {/* Post Content */}
        <div className="relative">
          {/* Three Dots Button */}
          <div className="absolute top-2 right-2">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="text-gray-500 hover:text-gray-700"
            >
              &#8942; {/* Vertical three dots */}
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-32 bg-white shadow-lg rounded">
                <button
                  onClick={handleUpdate}
                  className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                >
                  Update
                </button>
                <button
                  onClick={handleDelete}
                  className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                >
                  Delete
                </button>
              </div>
            )}
          </div>

          {/* Post Header */}
          <div className="flex items-center mb-4">
            <img
              src={post.author.profileImage}
              alt={post.author.name}
              className="w-12 h-12 rounded-full mr-3"
            />
            <div>
              <h1 className="text-xl font-semibold">{post.title}</h1>
              <div className="text-gray-500 text-sm">
                By {post.author.name} • {post.createdAt}
              </div>
            </div>
          </div>
          <p className="text-gray-700">{post.content}</p>
        </div>

        {/* Tags Section */}
        <div className="mt-4">
          <div className="flex gap-2">
            {post?.tags?.map((tag, index) => (
              <span key={index} className="font-semibold text-gray-800">
          #{tag}
        </span>
            ))}
          </div>
        </div>

        {/* Like and Reaction Buttons */}
        <div className="flex items-center gap-4 mt-4">
          {/* Like Button */}
          <button
            onClick={handleLike}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300"
          >
            ⬆ <span>{likes}</span>
          </button>

          {/* Reaction Buttons */}
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

        {/* Add Reaction */}
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

      {/* Add a Comment */}
      <div className="mb-4">
        {isAddingComment ? (
          <div className="relative">
            {/* Multi-line Input */}
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write your comment..."
              rows={2} // Two lines
              className="w-full px-4 py-2 rounded-full shadow bg-gray-200 text-gray-700 resize-none"
            />

            {/* Buttons */}
            <div className="flex justify-between items-center mt-2 gap-4">
              {/* Make a Mention */}
              <button
                onClick={() => {
                  if (newComment.trim()) {
                    setMentions((prev) => [...prev, newComment.trim()]);
                    setNewComment(""); // Clear input
                  }
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full shadow hover:bg-gray-300"
              >
                Make a Mention
              </button>

              {/* Cancel and Comment Buttons */}
              <div className="flex justify-end gap-2">
                {/* Cancel Button */}
                <button
                  onClick={handleCancelComment}
                  className="px-4 py-2 text-gray-700 rounded-full shadow hover:bg-gray-300"
                >
                  Cancel
                </button>

                {/* Comment Button */}
                <button
                  onClick={handleAddComment}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full shadow hover:bg-gray-300"
                >
                  Comment
                </button>
              </div>
            </div>

            {/* Display Mentions */}
            <div className="flex flex-wrap items-center mt-4 gap-2">
              {mentions.map((mention, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-gray-50 text-gray-000 font-bold rounded-full shadow"
                  onClick={() => handleRemoveMention(index)}
                >
            @{mention}
          </span>
              ))}
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


      {/* Comments Section */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-4">Comments</h2>
        {post.comments.map((comment) => (
          <div key={comment.id} className="mb-4">
            {/* Comment */}
            <div className="flex items-start mb-2">
              <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
              <div>
                <div className="font-semibold">{comment.author}</div>
                <p className="text-gray-700">{comment.content}</p>
              </div>
            </div>
            {/* Replies */}
            {comment.replies.map((reply) => (
              <div key={reply.id} className="ml-12 mt-2">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-gray-200 rounded-full mr-3"></div>
                  <div>
                    <div className="font-semibold">{reply.author}</div>
                    <p className="text-gray-700">{reply.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

    </div>
  );
};

export default PostDetail;
