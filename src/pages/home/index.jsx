import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';

import HomePageCreatePost from 'components/home/create-post';
import MainLayout from 'components/shared/main-layout';
import { getImageSource } from 'utils/helper';
import { createPostHandler, getPostsHandler } from 'api/post';
import { addPostToPostsAction, getPostsAction } from 'redux-store/slices/post';
import CustomHashLoader from 'components/shared/custom-hash-loader';
import HomePagePosts from 'components/home/posts';
import NoResult from 'components/shared/no-result';

const Home = () => {
  const [content, setContent] = useState('');
  const [createPostLoading, setCreatePostLoading] = useState(false);
  const [getPostsLoading, setGetPostsLoading] = useState(true);

  const { user } = useSelector((state) => state.user);
  const { posts } = useSelector((state) => state.post);

  const dispatch = useDispatch();

  const userImage = getImageSource(user?.profilePic);

  useEffect(() => {
    handleGetPosts();

    return () => {};
  }, []);

  const handleChangeInput = (e) => setContent(e.target.value);

  const handleGetPosts = async () => {
    setGetPostsLoading(true);
    const { err, data } = await getPostsHandler(user?.token);
    if (err) {
      console.log(err);
      setGetPostsLoading(false);
      return toast.error(err?.message);
    }
    setGetPostsLoading(false);
    dispatch(getPostsAction(data?.data?.data));
  };

  const handleCreatePost = useCallback(async () => {
    setCreatePostLoading(true);
    const values = { content };
    const { err, data } = await createPostHandler(values, user?.token);
    if (err) {
      console.log(err);
      setCreatePostLoading(false);
      setContent('');
      return toast.error(err?.message);
    }
    setContent('');
    setCreatePostLoading(false);
    dispatch(addPostToPostsAction(data?.data?.data));
  }, [content, dispatch, user?.token, createPostLoading]);

  return (
    <MainLayout pageTitle={'Home'}>
      {getPostsLoading ? (
        <CustomHashLoader />
      ) : (
        <>
          <HomePageCreatePost
            source={userImage}
            username={user?.username}
            value={content}
            disabled={!content?.trim() || createPostLoading}
            onChange={handleChangeInput}
            onClick={handleCreatePost}
          />
          {posts?.length === 0 ? (
            <NoResult />
          ) : (
            <HomePagePosts
              posts={posts}
              userId={user?.id}
              token={user?.token}
            />
          )}
        </>
      )}
    </MainLayout>
  );
};

export default Home;
