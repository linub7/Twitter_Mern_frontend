import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { HashLoader } from 'react-spinners';

import { getSinglePostAndRepliesHandler } from 'api/post';
import CustomLoader from 'components/shared/custom-loader';
import MainLayout from 'components/shared/main-layout';
import PostsList from 'components/shared/posts-list';
import { getPostsAction } from 'redux-store/slices/post';
import ReplyModal from 'components/shared/reply-modal';

const Post = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetPost, setTargetPost] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [createReplyPostLoading, setCreateReplyPostLoading] = useState(false);

  const { posts } = useSelector((state) => state.post);

  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    if (!id) return navigate('/');
    handleGetSinglePostAndReplies();

    return () => {
      setIsLoading(false);
    };
  }, [id]);

  const handleClickChatBubble = (post) => {
    setIsModalOpen(true);
    setTargetPost(post);
  };
  const handleGetSinglePostAndReplies = async () => {
    setIsLoading(true);
    const { err, data } = await getSinglePostAndRepliesHandler(id, user?.token);
    if (err) {
      console.log(err);
      setIsLoading(false);
      toast.error(err?.message);
      return navigate('/');
    }
    setIsLoading(false);
    dispatch(getPostsAction(data?.data?.data));
  };
  return (
    <MainLayout pageTitle={`View Post`}>
      {isLoading ? (
        <CustomLoader>
          <HashLoader color={'#9bd1f9'} />
        </CustomLoader>
      ) : (
        <PostsList
          posts={posts}
          token={user?.token}
          userId={user?.id}
          handleClickChatBubble={handleClickChatBubble}
        />
      )}

      {isModalOpen && (
        <ReplyModal
          replyContent={replyContent}
          targetPost={targetPost}
          user={user}
          createReplyPostLoading={createReplyPostLoading}
          setCreateReplyPostLoading={setCreateReplyPostLoading}
          setIsModalOpen={setIsModalOpen}
          setReplyContent={setReplyContent}
          setTargetPost={setTargetPost}
        />
      )}
    </MainLayout>
  );
};

export default Post;
