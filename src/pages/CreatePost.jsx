import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate import
import apiClient from "../utils/apiClient";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [attachments, setAttachments] = useState([]); // Multiple files
  const [activeTab, setActiveTab] = useState("body"); // 'body', 'media', 'tags'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate(); // useNavigate 초기화

  const handleAddTag = () => {
    if (newTag.trim()) {
      setTags((prevTags) => [...prevTags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (index) => {
    setTags((prevTags) => prevTags.filter((_, i) => i !== index));
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    setAttachments((prev) => [...prev, ...files]);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setAttachments((prev) => [...prev, ...files]);
  };

  const handleRemoveFile = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content) {
      setError("Title and content are required.");
      return;
    }

    const postRegisterCombinedRequest = {
      postRegisterRequest: {
        title,
        content,
      },
      postsTagRegisterRequest: tags.map((tag) => ({ contents: tag })),
    };

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      // 포스트 생성 요청
      const response = await apiClient.post("/posts", postRegisterCombinedRequest);

      if (response.status === 201) {
        const postId = response.data.data; // 백엔드에서 생성된 포스트 ID 반환
        setSuccess(true);
        console.log(postId);

        // 파일 업로드 요청
        if (attachments.length > 0) {
          const formData = new FormData();
          formData.append("postId", postId); // postId를 문자열로 변환
          attachments.forEach((file) => formData.append("files", file));
          console.log(formData);
          await apiClient.post("/upload/files", formData);
        }

        // 메인 페이지로 이동
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to create the post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mx-auto bg-white p-6 shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Create Post</h1>

        {/* Fragment Buttons */}
        <div className="flex justify-content mb-4 p-2 gap-2">
          <button
            onClick={() => setActiveTab("body")}
            className={`px-4 py-2 text-sm rounded-full shadow ${
              activeTab === "body"
                ? "bg-gray-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Write Body
          </button>
          <button
            onClick={() => setActiveTab("media")}
            className={`px-4 py-2 text-sm rounded-full shadow ${
              activeTab === "media"
                ? "bg-gray-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Upload Media
          </button>
          <button
            onClick={() => setActiveTab("tags")}
            className={`px-4 py-2 text-sm rounded-full shadow ${
              activeTab === "tags"
                ? "bg-gray-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Add Tags
          </button>
        </div>

        {/* Title Input */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter your title"
          className="w-full px-4 py-2 rounded shadow bg-gray-50 text-gray-700 mb-4"
        />

        {/* Active Tab Content */}
        {activeTab === "body" && (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your content..."
            rows={4}
            className="w-full px-4 py-2 rounded shadow bg-gray-200 text-gray-700 resize-none mb-4"
          />
        )}

        {activeTab === "media" && (
          <div>
            {/* Drag-and-Drop Area */}
            <div
              className="w-full h-32 border-2 border-dashed border-gray-400 flex items-center justify-center text-gray-700 relative mb-4"
              onDrop={handleFileDrop}
              onDragOver={(e) => e.preventDefault()}
            >
              <p className="text-center">
                Drag and drop files here, or click to upload
              </p>
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>

            {/* Uploaded Files List */}
            <div className="space-y-2">
              {attachments.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-200 p-2 rounded shadow"
                >
                  <span className="text-gray-700">{file.name}</span>
                  <button
                    onClick={() => handleRemoveFile(index)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "tags" && (
          <div className="mb-4">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag"
                className="px-4 py-2 rounded shadow bg-gray-200 text-gray-700 flex-1"
              />
              <button
                onClick={handleAddTag}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded shadow hover:bg-gray-300"
              >
                Add Tag
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded shadow cursor-pointer"
                  onClick={() => handleRemoveTag(index)}
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && <p className="text-red-500 mb-2">{error}</p>}

        {/* Success Message */}
        {success && <p className="text-green-500 mb-2">Post created successfully!</p>}

        {/* Submit Button */}
        <div className="flex justify-end py-2">
          <button
            onClick={handleSubmit}
            className={`px-6 py-2 rounded-full shadow text-white ${
              loading ? "bg-gray-400" : "bg-gray-500 hover:bg-gray-600"
            }`}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Post"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
