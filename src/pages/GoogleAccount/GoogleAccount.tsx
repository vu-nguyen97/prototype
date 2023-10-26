import React, {useState} from "react";
import Page from "../../utils/composables/Page";
import Loading from "../../utils/Loading";
import GoogleAccountTable from "./GoogleAccountTable";
const GoogleAccount = () => {
    const [isLoading, setIsLoading] = useState(false);
    const listData = [
        {
            id:1,
            account: "account-1",
            email: "email-1",
            IP: "ip-1",
            chromePort: "chrome-port-1",
            vncPort: "vnc-port-1",
            vncpwd: "vnc-pwd-1"
        },
        {
            id:2,
            account: "account-2",
            email: "email-2",
            IP: "ip-2",
            chromePort: "chrome-port-2",
            vncPort: "vnc-port-2",
            vncpwd: "vnc-pwd-2"
        },
        {
            id:3,
            account: "account-3",
            email: "email-3",
            IP: "ip-3",
            chromePort: "chrome-port-3",
            vncPort: "vnc-port-3",
            vncpwd: "vnc-pwd-3"
        },
    ]
    const onEditData = (record) => {

    }

    const onDelete = (record) => {

    }
    return(
        <Page>
            {isLoading && <Loading />}
        <div>
            <h1 style={{fontSize: 40, fontWeight: "bold"}}>Google Play Account</h1>
            <div>
                <GoogleAccountTable
                    isLoading = {isLoading}
                    onEdit={onEditData}
                    onDelete={onDelete}
                    listData={listData}
                />
            </div>
        </div>

        </Page>
    )
}

export default GoogleAccount;