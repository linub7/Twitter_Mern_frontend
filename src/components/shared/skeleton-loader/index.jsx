import ContentLoader from 'react-content-loader';

const SkeletonLoader = (props) => {
  return (
    <ContentLoader
      rtl={props.rtl}
      speed={2}
      viewBox="0 0 600 40"
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
      {...props}
    >
      <rect x="15" y="15" rx="5" ry="5" width="220" height="20" />
    </ContentLoader>
  );
};

export default SkeletonLoader;
