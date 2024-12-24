import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import apiClient from "../utils/apiClient";

const EditPost = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const { post: initialPost } = location.state || {}; // 전달된 데이터 받기

  // 상태 초기화
  const [title, setTitle] = useState(initialPost?.title || "");
  const [content, setContent] = useState(initialPost?.content || "");
  const [tags, setTags] = useState(initialPost?.tags?.map((tag) => tag.contents) || []);
  const [uploads, setUploads] = useState(initialPost?.uploads || []);
  const [newTag, setNewTag] = useState("");
  const [newUploads, setNewUploads] = useState([]);
  const [activeTab, setActiveTab] = useState("body"); // 현재 탭 상태
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // API로 데이터 불러오기
  useEffect(() => {
    if (!initialPost) {
      const fetchPostDetails = async () => {
        setLoading(true);
        try {
          const response = await apiClient.get(`/posts/${postId}`);
          const { title, content, tags, uploads } = response.data.data;

          setTitle(title || "");
          setContent(content || "");
          setTags(tags ? tags.map((tag) => tag.contents) : []);
          setUploads(uploads || []);
        } catch (err) {
          console.error("Failed to fetch post details:", err);
          setError("Failed to load the post data.");
        } finally {
          setLoading(false);
        }
      };

      fetchPostDetails();
    }
  }, [postId, initialPost]);

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

  // 파일 추가
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setNewUploads((prev) => [...prev, ...files]);
  };

  // 파일 삭제
  const handleRemoveFile = (index) => {
    setNewUploads((prev) => prev.filter((_, i) => i !== index));
  };

  // 폼 제출
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const postUpdateRequest = {
      title,
      content,
      tags: tags.map((tag) => ({ contents: tag })),
    };

    try {
      // 게시물 업데이트
      await apiClient.put(`/posts/edit/${postId}`, postUpdateRequest);

      // 새로운 파일 업로드
      if (newUploads.length > 0) {
        const formData = new FormData();
        formData.append("postId", postId);
        newUploads.forEach((file) => formData.append("files", file));
        await apiClient.post("/upload/files", formData);
      }

      navigate(`/posts/${postId}`); // 상세 페이지로 이동
    } catch (err) {
      console.error("Failed to update post:", err);
      setError("Failed to update the post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center">Loading post data...</div>;
  }

  return (
    <div className="p-6">
      <div className="mx-auto bg-white p-6 shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Edit Post</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* 탭 버튼 */}
        <div className="flex justify-content mb-4 p-2 gap-2">
          {["body", "media", "tags"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm rounded-full shadow ${
                activeTab === tab
                  ? "bg-gray-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {tab === "body" ? "Edit Body" : tab === "media" ? "Manage Media" : "Manage Tags"}
            </button>
          ))}
        </div>

        {/* 제목 입력 */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter post title"
          className="w-full px-4 py-2 rounded shadow bg-gray-50 text-gray-700 mb-4"
        />

        {/* 본문 편집 */}
        {activeTab === "body" && (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Edit your content..."
            rows={4}
            className="w-full px-4 py-2 rounded shadow bg-gray-200 text-gray-700 resize-none mb-4"
          />
        )}

        {/* 파일 관리 */}
        {activeTab === "media" && (
          <div>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="block mb-2 w-full"
            />
            <ul className="list-disc list-inside">
              {newUploads.map((file, index) => (
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
        )}

        {/* 태그 관리 */}
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

        {/* 제출 버튼 */}
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
