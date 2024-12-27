import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ImageSlider = ({ uploads }) => {
  const sliderSettings = {
    dots: true, // 하단에 점 표시
    infinite: true, // 무한 스크롤
    speed: 500, // 슬라이더 속도
    slidesToShow: 1, // 한 번에 보여줄 슬라이드 수
    slidesToScroll: 1, // 한 번에 스크롤할 슬라이드 수
    adaptiveHeight: true, // 슬라이더 높이를 이미지에 맞게 조정
  };

  if (uploads.length === 0) return null; // 이미지가 없는 경우 아무것도 렌더링하지 않음

  return (
    <div className="w-full max-w-4xl mx-auto">
      {uploads.length > 1 ? (
        // 여러 이미지일 때 슬라이더 사용
        <Slider {...sliderSettings}>
          {uploads.map((image, index) => (
            <div key={`${image.url}-${index}`} className="overflow-hidden">
              <img
                src={image.url}
                alt={`Upload ${index + 1}`}
                className="w-full h-auto object-contain rounded"
              />
            </div>
          ))}
        </Slider>
      ) : (
        // 단일 이미지 표시
        <div className="overflow-hidden">
          <img
            src={uploads[0]?.url}
            alt="Post upload"
            className="w-full h-auto object-contain rounded"
          />
        </div>
      )}
    </div>
  );
};

export default ImageSlider;
