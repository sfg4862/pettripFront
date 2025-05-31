import host from '../../host.js'
import url from '../../defImages.js'
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CommunityPage.style.css";
import lockIcon from "../../images/CommunityPage/LockIcon.png";
import axios from 'axios'

const CommunityPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("최신순");
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setLoaing] = useState(1);
  const postsPerPage = 8;

  useEffect(() => {

    const r = axios.get(`${host}/BOARD/`,{
      withCredentials: true,
      headers :{
        "Content-Type":"application/json",
        "Authorization": `${sessionStorage.getItem('user_id')}`
      },
      params :{
        page : currentPage
      }})
      .then(r=>{
        setPosts(r.data.data);
        console.log(r.data.data);
        setLoaing(0);
      }
      )
      .catch(e=>{
        alert('잘못된 요청입니다.')}
      )
      
  }, [activeTab,currentPage]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredPosts(posts);
    } else {
      const filtered = posts.filter(
        (post) =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (!post.isPrivate &&
            post.content.toLowerCase().includes(searchTerm.toLowerCase())) ||
          post.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPosts(filtered);
    }
    setCurrentPage(1);
  }, [searchTerm, posts]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };

  const handlePostClick = (postId) => {
    navigate(`/community/post/${postId}`);
  };

  const handleWriteClick = () => {
    navigate("/community/write");
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const renderPageNumbers = () => {
    let pageNumbers = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pageNumbers = [1, 2, 3, 4, 5];
      } else if (currentPage >= totalPages - 2) {
        pageNumbers = [
          totalPages - 4,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages,
        ];
      } else {
        pageNumbers = [
          currentPage - 2,
          currentPage - 1,
          currentPage,
          currentPage + 1,
          currentPage + 2,
        ];
      }
    }
    return pageNumbers;
  };

  return (
    <div className="community-page">
      <div className="community-container">
        <div className="tab-section">
          <div className="tab-buttons">
            <button
              className={activeTab === "최신순" ? "active" : ""}
              onClick={() => handleTabClick("최신순")}
            >
              · 최신순
            </button>
            <button
              className={activeTab === "오래된순" ? "active" : ""}
              onClick={() => handleTabClick("오래된순")}
            >
              · 오래된순
            </button>
          </div>
          <form className="search-container" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="검색어를 입력해주세요."
              className="search-input"
              value={searchTerm}
              onChange={handleSearchInputChange}
            />
            <button type="submit" className="search-button">
              <svg
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
              </svg>
            </button>
          </form>
        </div>

        <div className="post-grid">
          { isLoading ? (
            <div className="no-results">로딩중..</div>
          ) : (
          currentPosts.length > 0 ? (
            currentPosts.map((post) => (
              <div
                key={post.id}
                className="post-card"
                onClick={() => handlePostClick(post.id)}
              >
                <div className="post-image-container">
                  {post.isPrivate ? (
                    <div className="private-post">
                      <img src={lockIcon} alt="비밀글" className="lock-icon" />
                    </div>
                  ) : (
                    post.imageUrl ? (
                      <img
                      src={`${host}/${post.imageUrl}`}
                      alt={post.title}
                      className="post-image"
                    />
                    ) : (
                    <img
                      src={url.defaultPostUrl}
                      alt={post.title}
                      className="post-image"
                    />
                    )
                  )}
                </div>
                <div className="post-content">
                  <h3 className="post-title">{post.title}</h3>
                  <p className="post-text">
                    {post.isPrivate ? "비밀글입니다." : post.content}
                  </p>
                  <p className="post-date">
                    {new Date(post.date).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      weekday: 'short',
                    })}요일
                  </p>
                </div>
                <div className="post-footer">
                  <div className="author-info">
                    <div className="author-avatar">
                      {post.profileImg ? (
                      <img src={`${host}/${post.profileImg}`} alt={post.author} />
                    ) : (
                      <img src={url.defaultProfileUrl} alt={post.author} />
                    )}
                    </div>
                    <span className="author-name">by. {post.author}</span>
                  </div>
                  <div className="like-section">
                    {post.isLiked === 1 ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="red"
                        viewBox="0 0 16 16"
                      >
                        <path d="M8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="#888"
                        viewBox="0 0 16 16"
                      >
                        <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z" />
                      </svg>
                    )}
                    <span className="like-count">{post.likes}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">검색 결과가 없습니다.</div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            <button
              className="pagination-btn"
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
            >
              〈〈
            </button>
            <button
              className="pagination-btn prev"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              〈
            </button>

            {renderPageNumbers().map((number) => (
              <button
                key={number}
                className={`pagination-btn ${
                  currentPage === number ? "active" : ""
                }`}
                onClick={() => handlePageChange(number)}
              >
                {number}
              </button>
            ))}

            <button
              className="pagination-btn next"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              〉
            </button>
            <button
              className="pagination-btn"
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
            >
              〉〉
            </button>
          </div>
        )}

        <div className="write-btn-container">
          <button className="write-btn" onClick={handleWriteClick}>
            글 작성하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
