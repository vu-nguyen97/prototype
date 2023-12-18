import React, { useState, useEffect } from "react";
import Page from "../../utils/composables/Page";
import SeleniumClientsTable from "./SeleniumClientsTables";
import { Client } from "@stomp/stompjs";
import { SOCKET_URL } from "../../partials/services/axios.config";

const SeleniumClients = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [listSeleniumClients, setListSeleniumClients] = useState<any>([]);

  // useEffect(() => {
  //   setIsLoading(true);
  //   service.get("/selenium-clients").then(
  //     (res: any) => {
  //       console.log("res", res);
  //       setIsLoading(false);
  //     },
  //     () => setIsLoading(false)
  //   );
  // });

  useEffect(() => {
    const onConnected = () => {
      client.subscribe(`/topic/selenium-clients`, function (msg) {
        setIsLoading(false);
        if (msg.body) {
          const jsonBody = JSON.parse(msg.body);
          if (!jsonBody) return;
          setListSeleniumClients(jsonBody.clients);
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

  return (
    <Page>
      <div className="flex justify-between">
        <div className="page-title">Clients</div>
      </div>
      <div className="mt-2">
        <SeleniumClientsTable
          listData={listSeleniumClients}
          isLoading={isLoading}
        />
      </div>
    </Page>
  );
};

export default SeleniumClients;
