import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./CommunityPostDetail.style.css";
import host from '../../host.js';
import url from '../../defImages.js';
import axios from 'axios';

const CommunityPostDetail = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allPosts, setAllPosts] = useState([]);
        
  useEffect(() => {

    const fetchPostData = () => {
      setLoading(true);

      const r = axios.get(`${host}/post/${postId}`,{
      withCredentials: true,
      headers: {
        "Content-Type":"application/json",
        "X-User-ID": `${sessionStorage.getItem('user_id')}`
      }})
      .then(r => {
        setPost(r.data)
        setLoading(false);
      })
      .catch(e => {
        alert('잘못된 요청입니다.');
      })

    };

    fetchPostData();
  }, [postId]);

  const handlePrevPost = () => {
    if (parseInt(postId) > 1) {
      navigate(`/community/post/${parseInt(postId) - 1}`);
    } else {
      navigate("/community");
    }
  };

  const handleNextPost = () => {
    const hasNextPost = allPosts.some((p) => p.id === parseInt(postId) + 1);

    if (hasNextPost) {
      navigate(`/community/post/${parseInt(postId) + 1}`);
    } else {
      navigate("/community");
    }
  };

  const handleBackToList = () => {
    navigate("/community");
  };

  const handleShare = () => {
    alert("공유 기능이 구현될 예정입니다.");
  };

  const handleLike = () => {
    const likeRequestBody = {
      user_id : sessionStorage.getItem('user_id'),
      post_id : post.id
    }

    const r = axios.post(`${host}/like`,likeRequestBody,{
      header : {
        "Content-Type":"application/json"
      }}
    )
    .then(r => {
      if(r.data.isLiked == 1){
        const r2 = axios.post(`${host}/unlike`,likeRequestBody,{
          header : {
            "Content-Type":"application/json"
          }})
        .then(r2 => {
          alert("좋아요가 취소되었습니다.");
          navigate(0)
        })
        .catch(e =>{
          alert("잘못된 요청입니다.");
        })}
      else {
        alert("좋아요 등록이 완료되었습니다!");
        navigate(0)
      }
    })
    .catch(e => {
      alert("잘못된 요청입니다.");
      navigate(0)
    })

  };

  const handleComment = () => {
    alert("댓글 기능이 구현될 예정입니다.");
  };

  if (loading) {
    return <div className="post-detail-loading">로딩 중...</div>;
  }
  
  else if (!post) {
    return <div className="post-detail-error">게시글을 찾을 수 없습니다.</div>;
  }

  
  return (
    <div className="post-detail-page">
      <div className="post-detail-container">
        <div className="post-navigation">
          <button className="nav-button prev" onClick={handlePrevPost}>
            &#10094;
          </button>
          <button className="nav-button next" onClick={handleNextPost}>
            &#10095;
          </button>
        </div>

        <div className="post-detail-content">
          <div className="post-author">
            <div className="author-avatar">
              {post.profileImg ? (
                <img src={`${host}/${post.profileImg}`} alt={post.author} />
              ):(
                <img src={url.defaultProfileUrl} alt={post.author} />
              )}
            </div>
            <span className="author-name">{post.author}</span>
          </div>

          <div className="post-image-container">
            {post.imageUrl ? (
              <img
              src={`${host}/${post.imageUrl}`}
              alt={post.title}
              className="post-detail-image"
            />
            ):(
              <img
              src={url.defaultPostUrl}
              alt={post.title}
              className="post-detail-image"
            />
            )}
            
          </div>

          <div className="post-text-content">
            <div className="post-content-text">{post.content}</div>

            <div className="post-tags">
              {post.tags && post.tags.map((tag, index) => (
                <span key={index} className="post-tag">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="post-actions">
                <div className="left-actions">
                  <button className="action-button back" onClick={handleBackToList}>
                    목록
                  </button>
                  {String(post.user_id) === sessionStorage.getItem('user_id') && (
                      <>
                        <button className="action-button delete" onClick={() => {
                          const confirmed = window.confirm("정말로 이 게시글을 삭제하시겠습니까?");
                          if (confirmed) {
                            axios.delete(`${host}/post/${post.id}`, {
                              headers: {
                                "Content-Type": "application/json",
                                "X-User-ID": sessionStorage.getItem('user_id')
                              },
                              withCredentials: true
                            })
                                .then(() => {
                                  alert("게시글이 삭제되었습니다.");
                                  navigate("/community");
                                })
                                .catch(() => {
                                  alert("게시글 삭제에 실패했습니다.");
                                });
                          }
                        }}>
                          삭제
                        </button>
                        <button className="action-button next"
                                onClick={() => navigate(`/community/post/edit/${post.id}`)}>수정
                        </button>
                      </>
                  )}
                  
                </div>
            <div className="right-actions">
              <button className="action-button share" onClick={handleShare}>
                공유하기
              </button>
              {post.isLiked === 1 ?(
              <button className="action-button like" onClick={handleLike}>
                좋아요 {post.likes}
              </button>
              ) : (
              <button className="action-button none-like" onClick={handleLike}>
                좋아요 {post.likes}
              </button>
              )}
              <button className="action-button comment" onClick={handleComment}>
                댓글
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPostDetail;
