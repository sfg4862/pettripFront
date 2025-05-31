import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./CommunityPostEdit.style.css";
import axios from 'axios';
import host from '../../host.js';
import url from '../../defImages.js'

const CommunityPostEdit = () => {
    const { postId } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [allPosts, setAllPosts] = useState([]);
    const [isEditing, setIsEditing] = useState(true);

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

        const r = axios.post(`/like`,likeRequestBody,{
            header : {
                "Content-Type":"application/json"
            }}
        )
            .then(r => {
                if(r.data.isLiked == 1){
                    const r2 = axios.post(`/unlike`,likeRequestBody,{
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

    if (!post) {
        return <div className="post-detail-error">게시글을 찾을 수 없습니다.</div>;
    }

    return (
        <div className="post-detail-page">
            <div className="post-detail-container">

                <div className={`post-detail-content ${!isEditing ? 'blurred' : ''}`}>
                    <div className="post-author">
                        <div className="author-avatar">
                            {post.profileImg ? (
                            <img src={`${host}/${post.profileImg}`} alt={post.author} />
                            ):(
                            <img src={url.defaultPostUrl} alt={post.author} />
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
                        )
                        }
                    </div>

                    <div className="post-text-content">
                        {!isEditing ? (
                            <h2 className="post-title">{post.title}</h2>
                        ) : (
                            <input
                                type="text"
                                className="post-edit-title"
                                value={post.title}
                                onChange={(e) => setPost({ ...post, title: e.target.value })}
                            />
                        )}
                        {!isEditing ? (
                            <div className="post-content-text">{post.content}</div>
                        ) : (
                            <textarea
                                className="post-edit-textarea"
                                value={post.content}
                                onChange={(e) => setPost({ ...post, content: e.target.value })}
                            />
                        )}

                        <div className="post-tags">
                            {post.tags && post.tags.map((tag, index) => (
                                <span key={index} className="post-tag">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="post-actions">
                        <button className="action-button back" onClick={handleBackToList}>
                            목록
                        </button>
                        <button
                            className="action-button delete"
                            onClick={() => {
                                const confirmed = window.confirm("이 게시글을 수정하시겠습니까?");
                                if (confirmed) {
                                    const formData = new FormData();
                                    formData.append("post_title", post.title);
                                    formData.append("post_content", post.content);
                                    formData.append("password", "NULL"); // 필요하다면 비밀번호 추가

                                    axios.put(`${host}/post/${post.id}`, formData, {
                                        headers: {
                                            "Content-Type": "multipart/form-data",
                                            "X-User-ID": sessionStorage.getItem("user_id")
                                        },
                                        withCredentials: true
                                    })
                                        .then(() => {
                                            alert("게시글이 수정되었습니다.");
                                            navigate("/community");
                                        })
                                        .catch(() => {
                                            alert("게시글 수정에 실패했습니다.");
                                        });
                                }
                            }}
                        >
                            수정
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommunityPostEdit;
