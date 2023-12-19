import CheckCircleOutlined from "@ant-design/icons/lib/icons/CheckCircleOutlined";
import CloseCircleOutlined from "@ant-design/icons/lib/icons/CloseCircleOutlined";
import ExclamationCircleOutlined from "@ant-design/icons/lib/icons/ExclamationCircleOutlined";
import { FaRegBell } from "@react-icons/all-files/fa/FaRegBell";
import { FaRegBellSlash } from "@react-icons/all-files/fa/FaRegBellSlash";
import { Client } from "@stomp/stompjs";
import { Tooltip } from "antd";
import Badge from "antd/lib/badge";
import Divider from "antd/lib/divider";
import Empty from "antd/lib/empty";
import message from "antd/lib/message";
import Skeleton from "antd/lib/skeleton/Skeleton";
import Switch from "antd/lib/switch";
import classNames from "classnames";
import React, { useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { NOTIFICATION_TYPES } from "../../constants/constants";
import { updateNotification } from "../../redux/socket/notificationSlice";
import { RootState } from "../../redux/store";
import { getBeforeTime } from "../../utils/Helpers";
import { getExternalUrl } from "../../utils/ProtectedRoutes";
import Transition from "../../utils/Transition";
import service, { SOCKET_URL, baseURL } from "../services/axios.config";

export const getNotificationTypeIcon = (data) => {
  const isSuccessType = data.type === NOTIFICATION_TYPES.success;
  const isErrType = data.type === NOTIFICATION_TYPES.error;
  const isWarningType = data.type === NOTIFICATION_TYPES.warning;

  return (
    <>
      {isSuccessType && (
        <CheckCircleOutlined className="text-base !text-green-600 mr-1" />
      )}
      {isErrType && (
        <CloseCircleOutlined className="text-base !text-red-500 mr-1" />
      )}
      {isWarningType && (
        <ExclamationCircleOutlined className="text-base !text-orange-500 mr-1" />
      )}
    </>
  );
};

const NOTICATION_MUTED = "notification-mute";

function Notifications() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const totalNotification = useSelector(
    (state: RootState) => state.notification.totalNotifications
  );

  const [latestNotificationData, setLatestNotificationData] = useState<any>();

  useEffect(() => {
    console.log("Location >> ", location.pathname);
  }, [location]);

  const notificationUrl = "/settings/notifications";
  const maxNotifications = 20;
  const getMutedStatus = () => {
    return localStorage.getItem(NOTICATION_MUTED) === "true" ? true : false;
  };

  const [isLoading, setIsLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationData, setNotificationData] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalData, setTotalData] = useState(0);
  const [isMuted, setIsMuted] = useState(getMutedStatus());

  const trigger = useRef(null);
  const dropdown = useRef(null);

  useEffect(() => {
    service.get("/notification/count").then(
      (res: any) => {
        if (res.results) {
          dispatch(updateNotification({ newValue: res.results }));
        }
      },
      () => {}
    );
  }, []);

  useEffect(() => {
    if (!latestNotificationData) return;

    if (
      latestNotificationData.popUp &&
      latestNotificationData.type === NOTIFICATION_TYPES.success
    ) {
      const pathname = location.pathname;
      switch (latestNotificationData.title) {
        case "Create Release Request":
          if (pathname === "/release") {
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          }
          break;
        case "Create Custom Listing Request":
          if (/^\/apps\/\d+\/custom-store-listing$/.test(pathname)) {
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          }
          break;
        case "Sync Apps Request":
          if (pathname === "/apps") {
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          }
          break;
        case "Fetch Custom Listings Request":
          if (/^\/apps\/\d+\/custom-store-listing$/.test(pathname)) {
            console.log("Refresh");
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          }
          break;
        case "Fetch Main Listing Request":
          if (/^\/apps\/\d+\/main-store-listing$/.test(pathname)) {
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          }
          break;
      }
    }
  }, [latestNotificationData]);

  useEffect(() => {
    const onConnected = () => {
      client.subscribe(`/topic/notifications`, function (msg) {
        if (msg.body) {
          const jsonBody = JSON.parse(msg.body);
          if (!jsonBody) return;

          const data = jsonBody;
          setLatestNotificationData(data);
          console.log("updateNotification :>> ", jsonBody);
          if (data) {
            dispatch(updateNotification({}));

            if (data.popUp && !getMutedStatus()) {
              const messageText = data.createdBy + ": " + data.title;
              switch (data.type) {
                case NOTIFICATION_TYPES.error:
                  message.error(messageText);
                case NOTIFICATION_TYPES.warning:
                  message.warning(messageText);
                default:
                  message.success(messageText);
              }
            }
          }
        }
      });
    };

    const onDisconnected = () => {};

    const client = new Client({
      brokerURL: SOCKET_URL,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: onConnected,
      onDisconnect: onDisconnected,
    });

    client.activate();
    return () => {
      client.deactivate();
    };
  }, []);

  const getNoti = (page = 0) => {
    const params = { size: maxNotifications, page };
    setIsLoading(true);
    service.get("/notification", { params }).then(
      (res: any) => {
        setIsLoading(false);
        const newData = Array.isArray(res.results?.content)
          ? res.results?.content
          : [];
        const newTotalNoti = res.results?.totalElements;
        newTotalNoti !== totalData && setTotalData(newTotalNoti);

        if (!page) {
          setNotificationData(newData);
        } else {
          setNotificationData([...notificationData, ...newData]);
          setCurrentPage(page);
        }
      },
      () => setIsLoading(false)
    );
  };

  const onClose = () => {
    setDropdownOpen(false);
    if (totalNotification) {
      dispatch(updateNotification({ newValue: 0 }));
    }
  };

  const onToggle = () => {
    if (dropdownOpen) {
      onClose();
    } else {
      setDropdownOpen(true);
    }
  };

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
      ) {
        return;
      }
      onClose();
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!dropdownOpen || keyCode !== 27) return;
      onClose();
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  const onClickBell = () => {
    onToggle();
    getNoti();
  };

  const goToNotificationPage = () => {
    onClose();

    setTimeout(() => {
      navigate(notificationUrl);
    }, 100);
  };

  const getReportScreenshotUrl = (item) => {
    return `${baseURL}/media/${item.mediaId}`;
  };

  const onMute = () => {
    localStorage.setItem(NOTICATION_MUTED, `${!isMuted}`);
    setIsMuted(!isMuted);
    setTimeout(() => {
      onClose();
    }, 400);
  };

  let maxHeight = window.innerHeight - 160;
  if (window.innerHeight > 660) {
    maxHeight = 500;
  }

  return (
    <div className="sm:relative inline-flex ml-3">
      <button
        ref={trigger}
        className="w-8 h-8 flex items-center justify-center transition duration-150 rounded-full"
        aria-haspopup="true"
        onClick={onClickBell}
        aria-expanded={dropdownOpen}
        tabIndex={-1}
      >
        <div className="flex items-center">
          <Badge count={totalNotification}>
            {isMuted ? (
              <FaRegBellSlash size={32} className="cursor-pointer" />
            ) : (
              <FaRegBell size={26} className="cursor-pointer" />
            )}
          </Badge>
        </div>
      </button>

      <Transition
        className="origin-top-right z-10 absolute top-3/4 sm:top-full right-0 mr-1 sm:mr-0 w-[300px] bg-white border border-slate-200 py-1.5 rounded-lg shadow-custom1 overflow-hidden mt-1"
        show={dropdownOpen}
        enter="transition ease-out duration-200 transform"
        enterStart="opacity-0 -translate-y-2"
        enterEnd="opacity-100 translate-y-0"
        leave="transition ease-out duration-200"
        leaveStart="opacity-100"
        leaveEnd="opacity-0"
      >
        <div
          className="relative"
          ref={dropdown}
          onFocus={() => setDropdownOpen(true)}
          onBlur={onClose}
        >
          <div className="flex justify-between pt-1.5 pb-2 px-4 border-b">
            <div className="text-sm text-slate-900 uppercase">
              Notifications
            </div>
            <Switch
              size="small"
              checked={!isMuted}
              onChange={onMute}
              title={
                isMuted ? "Turn on notifications" : "Turn off notifications"
              }
            />
          </div>

          {notificationData.length > 0 ? (
            <ul
              className="my-1 overflow-y-auto"
              style={{ maxHeight }}
              id="scrollableNotification"
            >
              <InfiniteScroll
                dataLength={notificationData.length}
                next={() => getNoti(currentPage + 1)}
                hasMore={totalData > notificationData.length}
                loader={<h4 className="ml-[22px] pr-4">Loading...</h4>}
                scrollableTarget="scrollableNotification"
              >
                {notificationData.map((data, idx) => {
                  const isNewNoti = totalNotification > idx;

                  return (
                    <React.Fragment key={idx}>
                      {data.mediaId ? (
                        <Tooltip title="View screenshot of failed action">
                          <li
                            className={classNames(
                              "flex py-1.5 pr-4 cursor-pointer",
                              isNewNoti ? "bg-slate-100" : "hover:bg-slate-50"
                            )}
                          >
                            {isNewNoti ? (
                              <div className="ml-2.5 mr-1.5 mt-[7px] w-1.5 h-1.5 bg-antPrimary rounded-full shrink-0" />
                            ) : (
                              <div className="ml-[22px]" />
                            )}
                            <div className="w-full">
                              <div className="text-sm mb-0.5 line-clamp-4">
                                <div
                                  className={`block truncate ${
                                    data.mediaId && "cursor-pointer"
                                  }`}
                                  // to={getExternalUrl(data.externalLink)}
                                  // to={"/external-url/" + data.externalLink}
                                  onClick={() => {
                                    if (data.mediaId) {
                                      window.open(
                                        getReportScreenshotUrl(data),
                                        "_blank"
                                      );
                                      onClose();
                                    }
                                  }}
                                >
                                  {getNotificationTypeIcon(data)}
                                  <span
                                    className="font-bold text-slate-900 truncate"
                                    title={data.createdBy}
                                  >
                                    {data.createdBy}:
                                  </span>
                                </div>
                                <div
                                  className="text-slate-900 line-clamp-4 break-words"
                                  dangerouslySetInnerHTML={{
                                    __html: data.description,
                                  }}
                                ></div>
                              </div>

                              <Link
                                className="block !text-xs !text-slate-400"
                                to={getExternalUrl(data.externalLink)}
                                onClick={onClose}
                              >
                                {getBeforeTime(data.createdDate)}
                              </Link>
                            </div>
                          </li>
                          {idx !== notificationData.length - 1 && (
                            <div className="mx-12">
                              <Divider className="!my-1" />
                            </div>
                          )}
                        </Tooltip>
                      ) : (
                        <>
                          <li
                            className={classNames(
                              "flex py-1.5 pr-4",
                              isNewNoti ? "bg-slate-100" : "hover:bg-slate-50"
                            )}
                          >
                            {isNewNoti ? (
                              <div className="ml-2.5 mr-1.5 mt-[7px] w-1.5 h-1.5 bg-antPrimary rounded-full shrink-0" />
                            ) : (
                              <div className="ml-[22px]" />
                            )}
                            <div className="w-full">
                              <div className="text-sm mb-0.5 line-clamp-4">
                                <div
                                  className={`block truncate ${
                                    data.mediaId && "cursor-pointer"
                                  }`}
                                  // to={getExternalUrl(data.externalLink)}
                                  // to={"/external-url/" + data.externalLink}
                                  onClick={() => {
                                    if (data.mediaId) {
                                      window.open(
                                        getReportScreenshotUrl(data),
                                        "_blank"
                                      );
                                      onClose();
                                    }
                                  }}
                                >
                                  {getNotificationTypeIcon(data)}
                                  <span
                                    className="font-bold text-slate-900 truncate"
                                    title={data.createdBy}
                                  >
                                    {data.createdBy}:
                                  </span>
                                </div>
                                <div
                                  className="text-slate-900 line-clamp-4 break-words"
                                  dangerouslySetInnerHTML={{
                                    __html: data.description,
                                  }}
                                ></div>
                              </div>

                              <Link
                                className="block !text-xs !text-slate-400"
                                to={getExternalUrl(data.externalLink)}
                                onClick={onClose}
                              >
                                {getBeforeTime(data.createdDate)}
                              </Link>
                            </div>
                          </li>
                          {idx !== notificationData.length - 1 && (
                            <div className="mx-12">
                              <Divider className="!my-1" />
                            </div>
                          )}
                        </>
                      )}
                    </React.Fragment>
                  );
                })}
              </InfiniteScroll>
            </ul>
          ) : (
            <>
              {isLoading ? (
                <div className="py-6 pl-5 pr-4">
                  <div className="flex flex-col space-y-2">
                    <Skeleton.Node className="rounded !h-3 !w-2/3" active>
                      {" "}
                    </Skeleton.Node>
                    <Skeleton.Node className="rounded !h-3 !w-full" active>
                      {" "}
                    </Skeleton.Node>
                    <Skeleton.Node className="rounded !h-3 !w-5/6" active>
                      {" "}
                    </Skeleton.Node>
                  </div>

                  <div className="flex flex-col space-y-2 mt-6">
                    <Skeleton.Node className="rounded !h-3 !w-2/3" active>
                      {" "}
                    </Skeleton.Node>
                    <Skeleton.Node className="rounded !h-3 !w-full" active>
                      {" "}
                    </Skeleton.Node>
                  </div>
                </div>
              ) : (
                <Empty className="py-10" />
              )}
            </>
          )}

          <div className="px-4 pt-2 mb-1 border-t">
            <div
              className="text-antPrimary cursor-pointer"
              onClick={goToNotificationPage}
            >
              View all notifications
            </div>
          </div>
        </div>
      </Transition>
    </div>
  );
}

export default Notifications;
