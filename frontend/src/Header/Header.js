import React, { useEffect, useState, useRef } from "react";
import "./Header.css";
import { IoIosNotifications } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { getSearchQuery } from "../Redux/actions/UserActions";
import { VscSearch } from "react-icons/vsc";

const Header = () => {
  const firstName = useSelector((state) => state.firstName);
  const lastName = useSelector((state) => state.lastName);
  const firstLetter = firstName ? firstName[0] : "";
  const lastLetter = lastName ? lastName[0] : "";
  const [greeting, setGreeting] = useState("");
  const dispatch = useDispatch();
  const timer = useRef(null);
  const handleSearch = (e) => {
    const v = e.target.value;
    // debounce 300ms
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      dispatch(getSearchQuery(v));
    }, 300);
  };

  const updateGreeting = () => {
    const time = new Date().getHours();
    if (time < 12) setGreeting("Good Morning");
    else if (time >= 12 && time < 16) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  };

  useEffect(() => {
    updateGreeting();
  }, []);

  return (
    <div className="header-container">
      <div className="header-greeting-container">
        <p>
          {" "}
          {greeting} {firstName} {lastName} 😊
        </p>
      </div>
      <div className="header-innerContainer">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search Here"
            onChange={handleSearch}
            className="header-searchBar"
          />
          <VscSearch />
        </div>
        <div className="notification-container">
          <IoIosNotifications size={25} />
          <span className="letterAvatar1">
            {firstLetter}
            {lastLetter}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Header;
