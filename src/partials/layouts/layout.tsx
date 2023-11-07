import React, { useState } from "react";
import Header from "../Header";
import {SidebarAppConfigs, SidebarConfigs, SidebarAdminConfigs, SidebarStoreAppConfigs} from "../sidebar/config";
import Sidebar from "../sidebar/Sidebar";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
function DefaultLayout({
  children = <></>,
  isDetailApp = false,
  isStoreApp = false,
  padding = true,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isOpenMobileMenu, setIsOpenMobileMenu] = useState(false);
  const isAdmin = useSelector(
    (state: RootState) => state.account.userData.isAdmin
  );
  const listConfigs= isDetailApp? SidebarAppConfigs: (isStoreApp? SidebarStoreAppConfigs: (isAdmin?SidebarAdminConfigs:SidebarConfigs));

  

  const onClickMobileMenu = () => {
    setIsOpenMobileMenu(!isOpenMobileMenu);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        isOpenMobileMenu={isOpenMobileMenu}
        setIsOpenMobileMenu={setIsOpenMobileMenu}
        listConfigs={listConfigs}
        isDetailApp={isDetailApp}
        isStoreApp={isStoreApp}
      />

      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header
          sidebarOpen={sidebarOpen}
          onClickMobileMenu={onClickMobileMenu}
        />

        <main>
          {padding ? (
            <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-8 w-full">
              {children}
            </div>
          ) : (
            <>{children}</>
          )}
        </main>
      </div>
    </div>
  );
}

export default DefaultLayout;
