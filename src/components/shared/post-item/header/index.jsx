import { Link } from 'react-router-dom';
import { BsFillPinFill, BsPin } from 'react-icons/bs';
import { IoCloseOutline } from 'react-icons/io5';

import styles from './styles.module.css';
import PostItemFooterButton from '../footer-button';

const PostItemHeader = ({
  post,
  userId,
  date,
  isShowHeaderRight = true,
  handleOpenPostPinModal = () => {},
  handleOpenWarningModal = () => {},
}) => {
  return (
    <div className={styles.header}>
      <div className={styles.header__left}>
        <Link
          className={styles.displayName}
          to={
            post?.postedBy?._id === userId
              ? `/profile`
              : `/profile/${post?.postedBy?.username}`
          }
        >
          {post?.postedBy?.firstName} {post?.postedBy?.lastName}
        </Link>
        <span className={styles.username}>@{post?.postedBy?.username}</span>
        <span className={styles.date}>{date}</span>
      </div>

      {isShowHeaderRight && (
        <div className={styles.header__right}>
          {userId === post?.postedBy?._id && (
            <>
              <PostItemFooterButton
                onClick={() => handleOpenPostPinModal(post)}
              >
                {post?.pinned ? (
                  <BsFillPinFill size={17} color="#1fa2f1" />
                ) : (
                  <BsPin size={17} color="#34495e" />
                )}
              </PostItemFooterButton>
              <PostItemFooterButton
                onClick={() => handleOpenWarningModal(post)}
              >
                <IoCloseOutline size={17} color="#e22252" />
              </PostItemFooterButton>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default PostItemHeader;
