import { JSX } from 'react';
import { ComponentRendering, Placeholder, useSitecore } from '@sitecore-content-sdk/nextjs';

import { HeroCarouselProps } from 'src/core/molecules/HeroCarousel/HeroCarousel.type';
import Slider from 'react-slick';
import SlickArrowButton from 'src/core/atom/SlickArrowButton';
export const Default = (props: HeroCarouselProps): JSX.Element => {
  const { page } = useSitecore();
  const carouselPhKey = `carouselslides-{*}`;
  const slides = props.rendering.placeholders?.[carouselPhKey] || [];
  const numberOfSlides = Number(props?.params?.SlidesToShow) || 1;
  const slidesToScroll = Number(props?.params?.SlidesToScroll) || 1;
  const enableCenterZoom = props?.params?.EnableCenterZoom === '1';
  const arrowPosition = props?.params?.ArrowPosition;
  const settings = {
    dots: arrowPosition !== 'Bottom',
    infinite: true,
    speed: 500,
    slidesToShow: numberOfSlides,
    slidesToScroll: slidesToScroll,
    fade: false,
    centerMode: true,
    centerPadding: '0px',
    initialSlide: 0,
    // arrows: true,
    nextArrow: <SlickArrowButton direction="right" />,
    prevArrow: <SlickArrowButton direction="left" />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div
      className={`carouselComponent [&_.slick-dots]:bottom-[25px]  [&_.slick-dots_li_button:before]:text-base  [&_.slick-dots_li.slick-active_button:before]:text-white
    [&_.slick-dots_li_button:before]:text-white  ${enableCenterZoom ? 'zoom-effect' : ''}`}
      role="region"
      aria-label="Image carousel"
      aria-roledescription="carousel"
    >
      <Slider {...settings}>
        {slides?.map((slide: ComponentRendering, idx: number) => (
          <div
            key={slide.uid || idx}
            role="group"
            aria-roledescription="slide"
            aria-label={`Slide ${idx + 1} of ${slides.length}`}
          >
            <Placeholder
              name={`carouselcontent-${props.params.DynamicPlaceholderId}`}
              rendering={{
                ...props.rendering,
                placeholders: {
                  [`carouselcontent-${props.params.DynamicPlaceholderId}`]: [slide],
                },
              }}
            />
          </div>
        ))}
      </Slider>
      {page.mode.isEditing && <Placeholder name={carouselPhKey} rendering={props.rendering} />}
    </div>
  );
};
