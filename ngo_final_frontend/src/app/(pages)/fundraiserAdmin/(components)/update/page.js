"use client";
import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import AsideBar, { TopHeader } from "@/component/fundraiser/fundraiserSidebar";
import styles from "./update.module.css";
import { FundraiserContext, fetchData } from "@/context/FundraiserContext";
import useAuth from "@/context/auth";
import Cookies from "js-cookie";
import Loading from "@/app/loading";
import { showSwal } from "@/validation";

export default function Update() {
  const { user } = useAuth("FUNDRAISER");
  const fundraiserCtx = useContext(FundraiserContext);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const data = Cookies.get("token");
    setToken(data);
  }, [Cookies]);

  const [target_amount, setTargetAmount] = useState();
  const [resolution, setResolution] = useState("");
  const [story, setMyStory] = useState("");
  const [money_raised_for, setRaisedFor] = useState("");

  useEffect(() => {
    if (fundraiserCtx?.fundraiser?.fundraiser?.fundraiser_page) {
      const { target_amount, resolution, story, money_raised_for } =
        fundraiserCtx?.fundraiser?.fundraiser?.fundraiser_page;
      setTargetAmount(parseInt(target_amount));
      setResolution(resolution || "");
      setMyStory(story || "");
      setRaisedFor(money_raised_for || "");
    }
  }, [fundraiserCtx?.fundraiser?.fundraiser?.fundraiser_page]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      showSwal("info", "Updating", "Please wait...");

      const data = {
        target_amount: parseInt(target_amount),
        resolution,
        story,
        money_raised_for,
      };
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_serverAPI}/fundraiser-page/updatePage/${fundraiserCtx?.fundraiser?.fundraiser?.fundraiser_page?.id}`,
        data,
        config
      );
      fundraiserCtx.fetchData();
      showSwal("success", "Done", "Update Succesfully!!");
    } catch (error) {
      console.error("Error submitting form:", error);
      showSwal("error", "Oops!", "Something went wrong");
    }
  };

  return user ? (
    <>
      <TopHeader
        link={`${fundraiserCtx.fundraiser?.fundraiser?.fundraiser_page?.id}`}
      />
      <aside className={styles.aside}>
        <AsideBar />

        <div className={styles.rightAside}>
          <h1>Update Fundraiser Page</h1>
          <form>
            <div className={styles.mainCol}>
              <div className={styles.firstCol}>
                <label htmlFor="FundraisingTarget">
                  Fundraising Target (INR)*
                  <br />
                  <input
                    type="number"
                    min="1"
                    value={target_amount}
                    name="FundraisingTarget"
                    className={styles.FundraisingTarget}
                    onChange={(e) => setTargetAmount(e.target.value)}
                  />
                </label>
                <label htmlFor="MyResolution">
                  <span>
                    About My Resolution * <span>Max 350 Characters</span>
                  </span>
                  <textarea
                    spellcheck="false"
                    value={resolution}
                    name="MyResolution"
                    className={styles.MyStory}
                    cols="30"
                    maxLength={350}
                    rows="10"
                    onChange={(e) => setResolution(e.target.value)}
                  ></textarea>
                  {resolution.length == 350 && (
                    <p style={{ color: "red", fontWeight: "normal" }}>
                      Characters reached to 350
                    </p>
                  )}
                </label>
              </div>
              <div className={styles.secondCol}>
                <label htmlFor="MyStory" className={styles.aboutMe}>
                  <span>
                    My Story * <span>Max 500 Characters</span>
                  </span>
                  <textarea
                    name="MyStory"
                    spellcheck="false"
                    value={story}
                    className={styles.MyStory}
                    maxLength={500}
                    cols="50"
                    rows="15"
                    onChange={(e) => setMyStory(e.target.value)}
                  ></textarea>
                  {story.length == 500 && (
                    <p style={{ color: "red", fontWeight: "normal" }}>
                      Characters reached to 500
                    </p>
                  )}
                </label>
              </div>
            </div>
            <div className={styles.thirdCol}>
              <label htmlFor="MoneyRaised">
                <span>
                  Money Raised For * <span>Max 500 Characters</span>
                </span>
                <textarea
                  spellcheck="false"
                  name="MoneyRaised"
                  value={money_raised_for}
                  className={styles.MoneyRaised}
                  cols="30"
                  maxLength={500}
                  rows="5"
                  onChange={(e) => setRaisedFor(e.target.value)}
                ></textarea>
                {money_raised_for.length == 500 && (
                  <p style={{ color: "red", fontWeight: "normal" }}>
                    Characters reached to 500
                  </p>
                )}
              </label>
            </div>
            <div className={styles.submitButton}>
              <button
                type="submit"
                onClick={handleSubmit}
                className={styles.formButton}
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </aside>
    </>
  ) : (
    <Loading />
  );
}
