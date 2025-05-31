import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./CommunityPostWritePage.style.css";
import host from '../../host.js'
import axios from 'axios'

const CommunityPostWritePage = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [password, setPassword] = useState("");
  const [content, setContent] = useState("");
  const [uploadedImages, setUploadedImages] = useState([]);
  const contentEditorRef = useRef(null);
  const fileInputRef = useRef(null);
  const formRef = useRef(new FormData());

  const handleTagInput = (e) => {
    if (e.key === "Enter" && currentTag.trim() !== "") {
      e.preventDefault();

      let tagText = currentTag.trim();
      if (!tagText.startsWith("#")) {
        tagText = `#${tagText}`;
      }

      if (!tags.includes(tagText)) {
        setTags([...tags, tagText]);
      }

      setCurrentTag("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const applyFormat = (command, value = null) => {
    document.execCommand(command, false, value);
    contentEditorRef.current.focus();
  };

  const triggerImageUpload = () => {
    fileInputRef.current.click();
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    files.forEach((file) => {
      if (file && file.type.startsWith("image/")) {
        formRef.current.set('media',file);
        const reader = new FileReader();
        reader.onload = (event) => {
          const newImage = {
            id: Date.now() + Math.random(),
            src: event.target.result,
            name: file.name,
            file: file,
          };
          setUploadedImages((prev) => [...prev, newImage]);
        };
        reader.readAsDataURL(file);
        //확인인
      }
    });
    e.target.value = "";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);

    files.forEach((file) => {
      if (file && file.type.startsWith("image/")) {
        formRef.current.set('media',file);
        const reader = new FileReader();
        reader.onload = (event) => {
          const newImage = {
            id: Date.now() + Math.random(),
            src: event.target.result,
            name: file.name,
            file: file,
          };
          setUploadedImages((prev) => [...prev, newImage]);
        };
        reader.readAsDataURL(file);
      }
    });
}
    

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const removeImage = (imageId) => {
    setUploadedImages((prev) => prev.filter((img) => img.id !== imageId));
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleSaveDraft = () => {
    alert("임시 저장되었습니다!");
  };

  const handlePublish = () => {
    if (!title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }

    if (!content.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }

    if (isPrivate && !password.trim()) {
      alert("비밀글 설정 시 비밀번호를 입력해주세요.");
      return;
    }

    console.log({
      title,
      content,
      tags,
      images: uploadedImages,
      isPrivate,
      password: isPrivate ? password : "",
    });

    const postData =  {
      post_table : "BOARD",
      post_title : title,
      post_content: contentEditorRef.current.innerHTML,
      user_id : sessionStorage.getItem('user_id'),
    }
    if(isPrivate)postData.post_password = password

    for (const key in postData) {
      formRef.current.set(key, postData[key]);
    }
    
    const r = axios.post(`${host}/post`,formRef.current,{
      headers: {
      }})
      .then(r => {
        navigate('/community');
        alert("게시글이 등록되었습니다!");
      })
      .catch(e => {
        alert('잘못된 요청입니다.');
      })
  };

  return (
    <div className="post-write-page">
      <div className="post-write-container">
        <input
          type="text"
          className="post-title-input"
          placeholder="제목을 입력하세요."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div className="tag-input-container">
          {tags.map((tag, index) => (
            <div key={`tag-${index}`} className="tag-chip">
              {tag}
              <button
                className="tag-remove-btn"
                onClick={() => handleRemoveTag(tag)}
              >
                ×
              </button>
            </div>
          ))}
          <input
            type="text"
            className="tag-input"
            placeholder="#태그를 입력해주세요."
            value={currentTag}
            onChange={(e) => setCurrentTag(e.target.value)}
            onKeyDown={handleTagInput}
          />
        </div>

        <div className="image-upload-section">
          <h3 className="section-title">📷 사진 업로드</h3>

          <div
            className="image-drop-zone"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={triggerImageUpload}
          >
            <div className="drop-zone-content">
              <div className="upload-icon">📁</div>
              <p>클릭하거나 이미지를 드래그해서 업로드하세요</p>
              <span className="upload-hint">JPG, PNG, GIF 파일 지원</span>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              accept="image/*"
              multiple
              onChange={handleImageUpload}
            />
          </div>

          {uploadedImages.length > 0 && (
            <div className="uploaded-images-preview">
              <h4>업로드된 이미지 ({uploadedImages.length}개)</h4>
              <div className="images-grid">
                {uploadedImages.map((image) => (
                  <div key={image.id} className="image-preview-item">
                    <img src={image.src} alt={image.name} />
                    <button
                      className="image-remove-btn"
                      onClick={() => removeImage(image.id)}
                    >
                      ×
                    </button>
                    <span className="image-name">{image.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="text-format-toolbar">
          <button onClick={() => applyFormat("formatBlock", "<h1>")}>H1</button>
          <button onClick={() => applyFormat("formatBlock", "<h2>")}>H2</button>
          <button onClick={() => applyFormat("formatBlock", "<h3>")}>H3</button>
          <button onClick={() => applyFormat("formatBlock", "<h4>")}>H4</button>
          <span className="toolbar-divider">|</span>
          <button onClick={() => applyFormat("bold")}>B</button>
          <button onClick={() => applyFormat("italic")}>I</button>
          <button onClick={() => applyFormat("underline")}>U</button>
        </div>

        <div className="content-section">
          <h3 className="section-title">✏️ 내용 작성</h3>
          <textarea
            ref={contentEditorRef}
            className="content-textarea"
            placeholder="게시글 내용을 입력해주세요..."
            value={content}
            onChange={handleContentChange}
          />
        </div>

        <div className="post-actions">
          <div className="post-options">
            <label className="private-option">
              <input
                type="checkbox"
                checked={isPrivate}
                onChange={() => setIsPrivate(!isPrivate)}
              />
              비밀글로 설정하기
            </label>
            {isPrivate && (
              <input
                type="password"
                className="private-password"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            )}
          </div>
          <div className="post-buttons">
            <button className="draft-btn" onClick={handleSaveDraft}>
              임시 저장 [6]
            </button>
            <button className="publish-btn" onClick={handlePublish}>
              게시하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPostWritePage;
