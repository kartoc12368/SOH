"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import "./swiper.css";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { FaMagnifyingGlass } from "react-icons/fa6";

const MySwiper = ({ image }) => {
  let sliderConfig = {
    spaceBetween: 10,
    navigation: true,
    slidesPerView: 3,
    slidesPerGroup: 3,
    allowTouchMove: true,
    loop: true,
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
    navigation: {
      nextEl: ".custom-arrow-next-artical",
      prevEl: ".custom-arrow-prev-artical",
    },
    breakpoints: {
      320: {
        slidesPerView: 1,
        spaceBetween: 10,
        slidesPerGroup: 1,
      },
      768: {
        slidesPerGroup: 1,
        spaceBetween: 10,
        slidesPerView: 1,
      },
      1024: {
        slidesPerGroup: 1,
        spaceBetween: 10,
        slidesPerView: 3,
      },
    },
  };

  return (
    <Swiper
      {...sliderConfig}
      className="mainSwiper"
      modules={[Autoplay, Navigation]}
    >
      {image &&
        image.map((image, index) => (
          <SwiperSlide key={index}>
            <a href={image} target="_blank" rel="noopener noreferrer">
              <img
                src={image}
                style={{ marginTop: "41px" }}
                alt={`Slide ${index + 1}`}
              />

              <FaMagnifyingGlass className="magnify" />
            </a>
          </SwiperSlide>
        ))}

      <div className="custom-arrow-next-artical swiper-button-next"></div>
      <div className="custom-arrow-prev-artical swiper-button-prev"></div>
    </Swiper>
  );
};
export const MySwiperTeamMember = ({ styles, teamData }) => {
  let sliderConfig = {
    navigation: true,
    slidesPerView: 3,
    slidesPerGroup: 3,
    allowTouchMove: true,
    loop: true,
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
    navigation: {
      nextEl: ".custom-arrow-next-artical",
      prevEl: ".custom-arrow-prev-artical",
    },
    breakpoints: {
      320: {
        slidesPerView: 1,
        slidesPerGroup: 1,
        spaceBetween: 2,
      },
      768: {
        slidesPerView: 2,
        spaceBetween: 2,
      },
      1024: {
        slidesPerGroup: 3,
        slidesPerView: 3,
        spaceBetween: 2,
      },
    },
  };
  return (
    <Swiper
      {...sliderConfig}
      className="teamMember"
      modules={[Autoplay, Navigation]}
    >
      {teamData.map((team, index) => (
        <SwiperSlide key={index}>
          <div className={styles.teamMember}>
            <img src={team.src} alt={team.name} width="173" height="220" />
            <div className={styles.teamMemberDetails}>
              <h3 className={styles.memberDetails}>
                {team.name}
                <br />
                {team.award ? (
                  team.award
                ) : (
                  <>
                    <br />
                  </>
                )}
                <br />
              </h3>
              <h4 className={styles.memberDetails}>{team.patron}</h4>
            </div>
          </div>
        </SwiperSlide>
      ))}
      <div className={`custom-arrow-next-artical swiper-button-next `}></div>
      <div className={`custom-arrow-prev-artical swiper-button-prev`}></div>
    </Swiper>
  );
};

export const OneSwiper = ({ OneImage }) => {
  let onesliderConfig = {
    navigation: true,
    slidesPerView: 1,
    slidesPerGroup: 1,
    allowTouchMove: true,
    loop: true,
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
    pagination: {
      clickable: true,
      el: ".swiper-pagination",
    },
    spaceBetween: 10,
    navigation: {
      nextEl: ".custom-arrow-next-artical",
      prevEl: ".custom-arrow-prev-artical",
    },
    breakpoints: {
      320: {
        slidesPerView: 1,
        slidesPerGroup: 1,
        spaceBetween: 10,
      },
      768: {
        slidesPerView: 1,
        spaceBetween: 10,
      },
      1024: {
        slidesPerView: 1,
        spaceBetween: 10,
      },
    },
  };
  return (
    <Swiper {...onesliderConfig} modules={[Navigation, Autoplay, Pagination]}>
      {OneImage.map((image, index) => (
        <SwiperSlide
          style={{ display: "flex", justifyContent: "center" }}
          key={index}
        >
          <img
            loading="eager"
            className="oneSwiperImage"
            src={image}
            alt={`Slide ${index + 1}`}
          />
        </SwiperSlide>
      ))}
      <div className={`custom-arrow-next-artical swiper-button-next `}></div>
      <div className={`custom-arrow-prev-artical swiper-button-prev`}></div>
      <div className="custom-swiper-pagination swiper-pagination"></div>
    </Swiper>
  );
};
export default MySwiper;
