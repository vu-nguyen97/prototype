import React, { useEffect, useState } from "react";
import Page from "../utils/composables/Page";
import Loading from "../utils/Loading";
import { CheckPassword, Logo, checkPasswordStr } from "../utils/helper/UIHelper";
import Input from "../partials/elements/Input";
import { Link, useNavigate } from "react-router-dom";
import service from "../partials/services/axios.config";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { useLocation } from 'react-router-dom';

const checkSpecialChars = (str) => {
  // https://stackoverflow.com/questions/32311081/check-for-special-characters-in-string
  // Remove: "-" character (accept this char)
  // Origin: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/
  const specialChars = /[!@#$%^&*()_+\=\[\]{};':"\\|,.<>\/?]+/;
  return specialChars.test(str);
};

function CreateNewPassword(props) {

  const location = useLocation();

  
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      onSubmit();
    }
  };

  const onSubmit = () => {
    const queryParams = new URLSearchParams(location.search);

    if (!newPassword) return;
    const payload = {
      password: newPassword,
      token: queryParams.get('token')
    };

    console.log('payload', payload);

    setIsLoading(true);
    service.post("/user/create-new-password", payload).then(
      (res: any) => {
        setIsLoading(false);
        toast(res.message, { type: "success" });
        setTimeout(() => {
          navigate("/login", { state: {  } });
        }, 1500);
      },
      () => setIsLoading(false)
    );
  };

  return (
    <Page>
      <section className="flex">
        {isLoading && <Loading />}
        {/* <PageBg /> */}

        <div className="page-wrapper">
          <Logo />
          <div className="page-content">
            <div className="page-content-padding">
              <h1 className="text-center text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                Create a new password
              </h1>
              <div className="space-y-4 md:space-y-6">
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={setNewPassword}
                  placeholder="Password"
                  required
                  noteRequire
                />
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  placeholder="Confirm Password"
                  required
                  noteRequire
                />
                <CheckPassword password={newPassword} className="ml-6" />                
                <button
                  type="submit"
                  className="btn-primary w-full"
                  disabled={
                    !newPassword ||
                    !confirmPassword ||
                    newPassword !== confirmPassword ||
                    !checkPasswordStr(newPassword)
                  }
                  onClick={onSubmit}
                >
                  Ok
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Page >
  );
}

export default CreateNewPassword;
