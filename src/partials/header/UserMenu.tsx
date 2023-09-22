import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Transition from "../../utils/Transition";

import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/account/accountSlice";
import { RootState } from "../../redux/store";
import { ORGANIZATION_PATH } from "../../constants/constants";
import classNames from "classnames";
import { useQueryClient } from "@tanstack/react-query";

function UserMenu() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const userData = useSelector((state: RootState) => state.account.userData);
  const organizationCode = userData.organization.code;
  const settingUrl =
    ORGANIZATION_PATH + "/" + organizationCode + "/settings/account";

  const dispatch = useDispatch();
  const trigger = useRef(null);
  const dropdown = useRef(null);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (
        !dropdownOpen ||
        !dropdown.current ||
        // @ts-ignore
        dropdown.current.contains(target) ||
        // @ts-ignore
        trigger.current.contains(target)
      )
        return;
      setDropdownOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  const goToSettingPage = () => {
    setDropdownOpen(false);

    setTimeout(() => {
      navigate(settingUrl);
    }, 100);
  };

  return (
    <div className="relative inline-flex">
      <div
        ref={trigger}
        className="inline-flex justify-center items-center cursor-pointer group"
        aria-haspopup="true"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        aria-expanded={dropdownOpen}
      >
        <div className="w-8 h-8 rounded-full flex-shrink-0 bg-green-700 text-white flex items-center justify-center">
          {userData.email && userData.email[0].toUpperCase()}
        </div>

        <div
          className="max-w-[200px] flex items-center truncate"
          title={userData.name}
        >
          <span
            className={classNames(
              "truncate text-sm font-medium group-hover:text-slate-800",
              userData.name ? "ml-2 mr-1" : "ml-1.5"
            )}
          >
            {userData.name}
          </span>
          <svg
            className="w-3 h-3 shrink-0 ml-1 mb-1 fill-current text-slate-400"
            viewBox="0 0 12 12"
          >
            <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
          </svg>
        </div>
      </div>

      <Transition
        className="origin-top-right z-10 absolute top-full right-0 min-w-44 bg-white border border-slate-200 py-1.5 rounded shadow-lg overflow-hidden mt-1"
        show={dropdownOpen}
        enter="transition ease-out duration-200 transform"
        enterStart="opacity-0 -translate-y-2"
        enterEnd="opacity-100 translate-y-0"
        leave="transition ease-out duration-200"
        leaveStart="opacity-100"
        leaveEnd="opacity-0"
      >
        <div
          ref={dropdown}
          onFocus={() => setDropdownOpen(true)}
          onBlur={() => setDropdownOpen(false)}
        >
          <div className="pt-0.5 pb-2 px-3 mb-1 border-b border-slate-200">
            <div className="font-medium text-slate-800">
              {userData.name || userData.email}
            </div>
            <div className="text-xs text-slate-500 italic">
              {userData.isAdmin ? "Administrator" : "User"}
            </div>
          </div>
          <ul>
            <li>
              <div
                className="font-medium text-sm text-indigo-500 hover:text-indigo-600 flex items-center py-1 px-3 cursor-pointer"
                onClick={goToSettingPage}
              >
                Settings
              </div>
            </li>
            <li>
              <Link
                className="font-medium text-sm text-indigo-500 hover:text-indigo-600 flex items-center py-1 px-3"
                to="/login"
                onClick={() => {
                  setDropdownOpen(!dropdownOpen);
                  dispatch(logout());
                  queryClient.clear();
                }}
              >
                Sign Out
              </Link>
            </li>
          </ul>
        </div>
      </Transition>
    </div>
  );
}

export default UserMenu;
