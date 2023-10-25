import React, {useState} from "react";
import Page from "../../../utils/composables/Page";
import Loading from "../../../utils/Loading";
import Button from "antd/lib/button";
import ModalAddStoreListing from "../AppDetails/ModalAddStoreListing";
const CustomStoreListing = () =>{
    const [isLoading, setIsLoading] = useState(false);
    const [isOpenModalAddApp, setIsOpenModalAddApp] = useState(false);
    return(
        <Page>
            {isLoading && <Loading />}
        <div>
            <h1 style={{fontSize: 40, fontWeight: "bold"}}>Custom Store Listing</h1>
            <h2 style={{fontSize:20}}>Customize your store listing to appeal to specific user segments</h2>
            <div style={{paddingTop: 30}}>
                <h1 style={{fontSize: 30, fontWeight: "bold"}}>Listings</h1>
                <p style={{paddingTop: 10, fontSize: 16}}>Users who are targeted by more than 1 listing will be shown the highest relevant listing in the list. Reorder the list to change the priority.</p>
                <p style={{fontSize:16}}>Users who aren't being targeted specifically will be shown your main store listing.</p>
                <div className="mt-1 sm:mt-0">
                        <Button type="primary" style={{marginRight:10}}>
                            Create Group
                        </Button>
                        <Button type="primary" onClick={(e) => setIsOpenModalAddApp(true)}>
                            Create Listing
                        </Button>
                </div>
                {/*<div className="mt-6">*/}
                {/*    <ConnectorTable*/}
                {/*        isAdmin={isAdmin}*/}
                {/*        isLoading={isLoadingTable}*/}
                {/*        listData={tableData}*/}
                {/*        onEdit={onEditData}*/}
                {/*        onDelete={onDelete}*/}
                {/*    />*/}
                {/*</div>*/}
            </div>
        </div>
            <ModalAddStoreListing
                isOpen={isOpenModalAddApp}
                onClose={() => setIsOpenModalAddApp(false)}
                setIsLoading={setIsLoading}
            />
        </Page>
    )
}

export default CustomStoreListing;