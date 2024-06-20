import MySwiper, { MySwiperTeamMember } from "@/component/MySwiper";

export default function Right({ styles, images, teamData }) {
  return (
    <>
      <div className={styles.rightSection}>
        <div className={styles.content}>
          <p>
            “It was a chance encounter in May 2016 with retired Army men,
            war-disabled soldiers and war-widows at Jantar Mantar. There was a
            70+ years old retired Sepoy who had a large family to support with
            his meagre pension. Both of his sons worked as daily labourers with
            no predictable income to feed their kids.
          </p>
          <img
            src="/images/summary(1).png"
            alt=""
            width="540"
            height="359"
            className={styles.summaryImage}
          />
          <p className={styles.middleTag}>
            This hit home as we had also experienced this lack of money at one
            point in our life after our father retired from the Army after 28
            years of service.
          </p>
          <img
            src="/images/summary(2).png"
            alt=""
            width="540"
            height="359"
            className={styles.summaryImage}
          />
          <p className={styles.middleTag}>
            We saw a lot of enthusiasm on social media about our soldiers but
            not enough tangible action to change their lives meaningfully.
            That's when Support Our Heroes (SOH) was born with an aim to "serve
            those who fought for us"
          </p>
          <img
            src="/images/summary(3).png"
            alt=""
            width="540"
            height="359"
            className={styles.summaryImage}
          />
        </div>
        <h2 className={styles.ourHeroes}>About Support Our Heroes</h2>
        <div className={styles.supportHeroesContent}>
          <p>
            Support Our Heroes(SOH) is dedicated to providing timely help since
            2017 to the needy Ex-soldiers and their families, disabled soldiers,
            Veer Naris / Widows, medically boarded out cadets from Officers
            Training Academies & PBOR from Training Centres who either cannot be
            helped under any Government/Armed Forces Scheme or they are given
            extremely long waiting period to receive the Governmental Aid.
          </p>
          <p>
            We are currently{" "}
            <span className={styles.boldText}>operational in 17 states</span>{" "}
            and have helped more than 300 Ex-soldiers (including sailors & air
            warriors) & their families so far.{" "}
            <span className={styles.boldText}>
              We are providing an ongoing help to 125 people every month
            </span>{" "}
            under our various projects outlined below :-
          </p>
          <p>
            <span className={styles.boldText}>(a) Project PITHU</span> aims to
            provide monthly ration for life to old non-pensioners/their widows
            living in penury in the far-flung parts of the country like
            North-East, Ladakh, Uttarakhand, Telangana etc. (90 soldiers/widows
            are being supported every month).
          </p>
          <img
            src="/images/ProjectPithu.png"
            alt="Project Pithu"
            width="540"
            height="359"
            className={`${styles.summaryImage} ${styles.projectImage}`}
          />
          <p>
            <span className={styles.boldText}>(b) Project SEHAT</span> aims to
            pay health-related costs like monthly medicines, medical check-up by
            doctors etc. for destitute and old non-pensioners/their widows (20
            soldiers/widows are being supported every month).
          </p>
          <img
            src="/images/ProjectSehat.png"
            alt="Project Sehat"
            width="540"
            height="359"
            className={`${styles.summaryImage} ${styles.projectImage}`}
          />
          <p>
            <span className={styles.boldText}>(c) Project SAKSHAM</span> aims to
            support children’s education (15 children of needy/disabled soldiers
            are being supported every month).
          </p>
          <img
            src="/images/ProjectSaksham.png"
            alt="Project Saksham"
            width="540"
            height="359"
            className={`${styles.summaryImage} ${styles.projectImage}`}
          />
          <p>
            <span className={styles.boldText}>(d) Project SASHAKT</span> aims to
            financially empower and provide livelihood opportunities to the
            widows of Ex-servicemen/needy veterans and their dependents (no
            monthly cases so far).
          </p>
          <img
            src="/images/ProjectSashakt.png"
            alt="Project Sashakt"
            width="540"
            height="359"
            className={`${styles.summaryImage} ${styles.projectImage}`}
          />
          <p>
            <span className={styles.boldText}>(e) Project INSANIYAT</span> aims
            to provide humanitarian assistance to Soldiers & their families as
            well as downtrodden people in the society (no monthly cases so far).
          </p>
          <img
            src="/images/ProjectInsaniyat.png"
            alt="Project Insaniyat"
            width="540"
            height="359"
            className={`${styles.summaryImage} ${styles.projectImage}`}
          />
          <p>
            <span className={styles.boldText}>
              (f) Wing Commander Vinod Nebb Memorial Scholarship:
            </span>{" "}
            Wg Cdr Vinod Nebb, VrC & Bar was one of our patrons who recently
            passed away. To recognize his active contribution to the growth of
            our NGO and celebrate his legacy we have recently started this
            scholarship for medically boarded out cadets from Officers Training
            Academies & PBOR from Training Centres who belong to poor economic
            background and are not getting any benefit of existing
            Government/Defence Schemes.
          </p>
          <img
            src="/images/CadetScholarship.png"
            alt="Cadet Scholarship"
            width="540"
            height="359"
            className={`${styles.summaryImage} ${styles.projectImage}`}
          />
        </div>
        <div className={styles.carousals}></div>
        <div className={styles.supportHeroesContent}>
          <p>
            We review every case expeditiously and try to offer meaningful help
            immediately through the above mentioned projects. While our funds
            are limited we can always have a bigger heart to help those in need.
            This belief is what attracts lots of like minded people to our
            cause.
          </p>
          <p>
            Our mission is to build an ecosystem that provides resettlement to
            abandoned old Ex-soldiers, ensures continued education for children
            of disabled Ex-soldiers & martyred soldiers and trains war widows to
            achieve self-sustainability.
          </p>
          <img
            src="/images/summary(4).png"
            alt=""
            width="540"
            height="359"
            className={`${styles.summaryImage} ${styles.projectImage}`}
          />
        </div>
        <h2 className={styles.ourTeams}>
          Meet the heartbeat of the organization (Our Team)
        </h2>
        <div className={styles.sliders}>
          <MySwiperTeamMember styles={styles} teamData={teamData} />
        </div>
        <p className={styles.sliderTag}>
          "Support Our Heroes (SOH)" is run by decorated Ex-Defence Officers of
          all three services (Army, Navy & Air Force).
        </p>
        <h2 className={styles.ourTeams}>Letters of Appreciation</h2>
        <div className={styles.sliders}>
          <div className={styles.LOA}>
            <MySwiper  styles={styles} image={images} />
          </div>
        </div>
        <a
          href="https://supportourheroes.in/letters-of-appreciation/"
          className={styles.viewAllPage}
        >
          View All
        </a>
      </div>
    </>
  );
}
