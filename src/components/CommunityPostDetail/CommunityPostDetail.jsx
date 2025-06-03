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
  const [commentValue, setCommentValue] = useState('');
        
  useEffect(() => {

    const fetchPostData = () => {
      setLoading(true);

      const r = axios.get(`${host}/post/${postId}`,{
      withCredentials: true,
      headers: {
        "Content-Type":"application/json",
        "Authorization": `${sessionStorage.getItem('user_id')}`
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
    axios.get(`${host}/BOARD/`,{
    params : {
      page : 1
    }
    })
    .then(r=>{
      const currentIndex = r.data.data.findIndex(p => p.id === post.id);
      let prevPostId = null;
      if (currentIndex != 0) {
      prevPostId = r.data.data[currentIndex - 1].id;
      navigate(`/community/post/${prevPostId}`);
      }
      else{
        alert('이전 게시물이 없습니다.');
      }
      })
    .catch(e=>{
      alert('잘못된 요청입니다.');
    });
  };

  const handleInputChange = (e) => {
    setCommentValue(e.target.value);
  };

  const handleNextPost = () => {
    
    axios.get(`${host}/BOARD/`,{
    params : {
      page : 1
    }
    })
    .then(r=>{
      const currentIndex = r.data.data.findIndex(p => p.id === post.id);
      let nextPostId = null;
      if (currentIndex != -1 && currentIndex < r.data.data.length - 1) {
      nextPostId = r.data.data[currentIndex + 1].id;
      
      navigate(`/community/post/${nextPostId}`);
      }
      else{
        alert('다음게시물이 없습니다.');
      }
      })
    .catch(e=>{
      alert('잘못된 요청입니다.');
    });
  };



  const handleBackToList = () => {
    navigate("/community");
  };

  const handleShare = () => {
    alert("공유 기능이 구현될 예정입니다.");
  };

  const handleLike = () => {
    if(!sessionStorage.getItem('user_id')){
      alert("로그인을 먼저 진행해 주세요!");
    }
    else{

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
            alert("공감이 취소되었습니다.");
            document.location.reload()
          })
          .catch(e =>{
            alert("잘못된 요청입니다.");
          })}
        else {
          alert("공감이 완료되었습니다!");
          document.location.reload()
        }
      })
      .catch(e => {
        alert("잘못된 요청입니다.");
        document.location.reload()
      })
    }
  };

  const handleAddComment = () => {

    const commentData = {
      user_id : sessionStorage.getItem('user_id'),
      post_id : post.id,
      content : commentValue
    }


    axios.post(`${host}/comment`,commentData,{
      headers : {
        "Content-Type": "application/json"
      }
      ,withCredentials: true 
    })
    .then(r => {
      alert('댓글 등록이 완료되었습니다!');
      document.location.reload();
    })
    .catch(e => {
      alert('잘못된 요청입니다.');
    })


    
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
          
          <div className="post-detail-title">
            {post.title}
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
          <div className='comment-area'>
            <h3>댓글 {post.comments.length}개</h3>
              <div>
                {post.comments.map((comment) => (
                  <div>
                  <hr style={{border: '1px solid #eee' }} />
                  <div key={comment.id} className='comment-item'>
                    <div className="comment-author-info">
                      <div className="post-author-avatar">
                        {comment.user_profil ? (
                        <img src={`${host}/${comment.user_profil}`} alt={post.author} />
                      ) : (
                        <img src={url.defaultProfileUrl} alt={post.author} />
                      )}
                      </div>
                      <span className="post-author-name">{comment.user_name}</span>
                    </div>
                    <div className="comment-content">{comment.content}</div>

                    { (sessionStorage.getItem('user_id') == comment.user_id) ? (
                      <div className="comment-button">
                      <button className="comment-delete" onClick={()=>{
                        const confirmed = window.confirm("정말로 이 댓글을 삭제하시겠습니까?");
                          if (confirmed) {
                            axios.delete(`${host}/comment/${comment.id}`, {
                              headers: {
                                "Content-Type": "application/json",
                                "Authorization": sessionStorage.getItem('user_id')
                              },
                              withCredentials: true
                            })
                                .then(() => {
                                  alert("댓글이 삭제되었습니다.");
                                  document.location.reload();
                                })
                                .catch(() => {
                                  alert("잘못된 요청입니다.");
                                });
                          }

                      }}>삭제</button>
                    </div>
                    ):(
                      ""
                    )}
                  
  
                  </div>
                  </div>
                ))}
              </div>

              { sessionStorage.getItem('user_id') ? (
              <div className= 'comment-add-area'>
                <div className='comment-input'>
                  <input
                    type='text'
                    value={commentValue}
                    onChange={handleInputChange}
                    placeholder='댓글을 입력하세요'
                  />
                  <button onClick={handleAddComment}>등록</button>
                </div>
              </div>
              ):(
                ""
              )}
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
                                "Content-Type": "application/json"
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
              {post.isLiked == 1 ?(
              <button className="action-button like" onClick={handleLike}>
                공감 {post.likes}
              </button>
              ) : (
              <button className="action-button none-like" onClick={handleLike}>
                공감 {post.likes}
              </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPostDetail;
