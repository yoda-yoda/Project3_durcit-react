import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiClient } from "../utils/apiClient";

const EditPost = ({ post, setIsEditing }) => {
  const { postId } = useParams();
  const navigate = useNavigate();

  // 상태 초기화
  const [title, setTitle] = useState(post.post.title || "");
  const [content, setContent] = useState(post.post.content || "");
  const [tags, setTags] = useState(post.tags.map((tag) => tag.contents) || []);
  const [newTag, setNewTag] = useState("");
  const [attachments, setAttachments] = useState([]); // 새 파일 업로드
  const [existingImages, setExistingImages] = useState(post.uploads || []); // 기존 이미지
  const [imagesToDelete, setImagesToDelete] = useState([]); // 삭제할 이미지 ID
  const [activeTab, setActiveTab] = useState("body");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 태그 추가
  const handleAddTag = () => {
    if (newTag.trim()) {
      setTags((prevTags) => [...prevTags, newTag.trim()]);
      setNewTag("");
    }
  };

  // 태그 삭제
  const handleRemoveTag = (index) => {
    setTags((prevTags) => prevTags.filter((_, i) => i !== index));
  };

  // 기존 이미지 삭제
  const handleRemoveExistingImage = (imageId) => {
    setExistingImages((prevImages) => prevImages.filter((image) => image.id !== imageId));
    setImagesToDelete((prev) => [...prev, imageId]);
  };

  // 새 파일 추가
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setAttachments((prev) => [...prev, ...files]);
  };

  // 새 파일 삭제
  const handleRemoveFile = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  // 폼 제출
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content) {
      setError("Title and content are required.");
      return;
    }

    const postUpdateCombinedRequest = {
      postUpdateRequest: {
        title: title,
        content: content,
      },
      postsTagRegisterRequests: tags.map((tag) => ({ contents: tag })), // 태그 배열 생성
    };

    setLoading(true);
    setError("");

    try {
      // 게시물 업데이트 요청
      await apiClient.put(`/posts/${postId}`, postUpdateCombinedRequest);

      // 파일 업로드가 필요한 경우만 요청 수행
      if (imagesToDelete.length > 0 || attachments.length > 0) {
        const formData = new FormData();
        formData.append("postId", postId);

        // 삭제할 이미지 ID 추가
        if (imagesToDelete.length > 0) {
          imagesToDelete.forEach((id) => formData.append("imageIdsToDelete", id));
        }

        // 새로 추가된 파일 추가
        if (attachments.length > 0) {
          attachments.forEach((file) => formData.append("newFiles", file));
        }

        // 파일 업로드 요청
        await apiClient.put("/upload/update", formData);
      }

      alert("Post updated successfully!");
      navigate(`/`); // 상세 페이지로 이동
    } catch (err) {
      console.error(err);
      setError("Failed to update the post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mx-auto bg-white p-6 shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Edit Post</h1>

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
            Edit Body
          </button>
          <button
            onClick={() => setActiveTab("media")}
            className={`px-4 py-2 text-sm rounded-full shadow ${
              activeTab === "media"
                ? "bg-gray-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Manage Media
          </button>
          <button
            onClick={() => setActiveTab("tags")}
            className={`px-4 py-2 text-sm rounded-full shadow ${
              activeTab === "tags"
                ? "bg-gray-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Manage Tags
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
            placeholder="Edit your content..."
            rows={4}
            className="w-full px-4 py-2 rounded shadow bg-gray-200 text-gray-700 resize-none mb-4"
          />
        )}

        {activeTab === "media" && (
          <div>
            {/* Existing Images */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Existing Images</h3>
              <div className="grid grid-cols-3 gap-4">
                {existingImages.map((image) => (
                  <div key={image.id} className="relative">
                    <img
                      src={image.url}
                      alt="Post Image"
                      className="w-full h-32 object-cover rounded shadow"
                    />
                    <button
                      onClick={() => handleRemoveExistingImage(image.id)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* New Files */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Upload New Files</h3>
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="block mb-2 w-full"
              />
              <ul className="list-disc list-inside">
                {attachments.map((file, index) => (
                  <li key={index} className="flex justify-between items-center">
                    {file.name}
                    <button
                      onClick={() => handleRemoveFile(index)}
                      className="text-red-500 hover:underline"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
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

        {/* Submit Button */}
        <div className="flex justify-end py-2">
          <button
            onClick={handleSubmit}
            className={`px-6 py-2 rounded-full shadow text-white ${
              loading ? "bg-gray-400" : "bg-gray-500 hover:bg-gray-600"
            }`}
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Post"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPost;
