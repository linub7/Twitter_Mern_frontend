const AttachmentInput = ({ inputRef, accept, handleChange = () => {} }) => {
  return (
    <input
      type="file"
      hidden
      ref={inputRef}
      accept={accept}
      onChange={handleChange}
    />
  );
};

export default AttachmentInput;
