import SkeletonLoader from '../skeleton-loader';

const MessagesSkeletons = () => {
  return (
    <>
      <SkeletonLoader />
      <SkeletonLoader rtl />
      <SkeletonLoader />
      <SkeletonLoader rtl />
    </>
  );
};

export default MessagesSkeletons;
