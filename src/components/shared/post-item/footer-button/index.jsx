const PostItemFooterButton = ({ children, onClick = () => {} }) => {
  return <button onClick={onClick}>{children}</button>;
};

export default PostItemFooterButton;
