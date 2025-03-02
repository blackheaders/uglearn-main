import React, { useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// import required modules
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import Image from "next/image";

export function SwiperComponent() {
  return (
    <>
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper w-full h-full"
      >
        <SwiperSlide className="text-center text-md  w-full">
        <picture>
  
    <source media="(max-width: 1000px)" srcSet="/finalcrsl.png" />
   
    <source media="(min-width: 1001px)" srcSet="/ugl90.png" />
   
    <img
      src="/ugl90.png"
      alt=""
      className="h-full w-full object-fit"
    />
  </picture>
</SwiperSlide>
      </Swiper>
    </>
  );
}

export function TeamSwiper() {
  return (
    <>
      <Swiper
  centeredSlides={true}
  slidesPerView={1} // Default value for smaller screens
  spaceBetween={10}
  loop={true} // Enable infinite loop
  autoplay={{
    delay: 2500, // Autoplay delay in milliseconds (2.5 seconds)
    disableOnInteraction: false, // Continue autoplay even after user interaction
  }}
  breakpoints={{
    // When the screen size is at least 768px (md)
    768: {
      slidesPerView: 2,
      spaceBetween: 30,
      centeredSlides: false,
    },
    // When the screen size is at least 1280px (xl)
    1280: {
      slidesPerView: 3,
      spaceBetween: 50,
      centeredSlides: false,
    },
  }}
  modules={[Autoplay, Pagination, Navigation]}
  className="mySwiper w-full h-full"
  onMouseEnter={(swiper) => swiper.autoplay.stop()} // Pause autoplay on hover
  onMouseLeave={(swiper) => swiper.autoplay.start()} // Resume autoplay on mouse leave
>
  <SwiperSlide className="text-center text-md flex justify-center items-center bg-white rounded-md">
    <Image
      height={500}
      width={500}
      src="https://res.cloudinary.com/dklqhgo8r/image/upload/v1738488328/fxe612kpv2srnvlyqrem.jpg"
      alt=""
      className="h-full w-full object-fill rounded-md"
    />
  </SwiperSlide>
  <SwiperSlide className="text-center text-md flex justify-center items-center bg-white rounded-md">
    <Image
      height={500}
      width={500}
      src="https://res.cloudinary.com/dklqhgo8r/image/upload/v1738488327/lcjdjrk8jxpzhx7kp1ez.jpg"
      alt=""
      className="h-full w-full object-fill rounded-md"
    />
  </SwiperSlide>
  
  <SwiperSlide className="text-center text-md flex justify-center items-center bg-white rounded-md">
    <Image
      height={500}
      width={500}
      src="https://res.cloudinary.com/dklqhgo8r/image/upload/v1738488323/pyvpyumgojsrjvbgacag.jpg"
      alt=""
      className="h-full w-full object-fill rounded-md"
    />
  </SwiperSlide>
</Swiper>
    </>
  );
}
