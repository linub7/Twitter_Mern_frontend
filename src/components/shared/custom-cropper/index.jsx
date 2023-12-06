import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';

const CustomCropper = ({ cropperRef, src, initialAspectRatio = 1 }) => {
  return (
    <Cropper
      ref={cropperRef}
      style={{ height: 400, width: '100%' }}
      zoomTo={0.5}
      initialAspectRatio={initialAspectRatio}
      preview=".img-preview"
      src={src}
      viewMode={1}
      minCropBoxHeight={10}
      minCropBoxWidth={10}
      background={false}
      responsive={true}
      autoCropArea={1}
      checkOrientation={false}
      guides={true}
    />
  );
};

export default CustomCropper;
