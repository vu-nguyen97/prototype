import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Input from "../partials/elements/Input";
import service from "../partials/services/axios.config";
import Page from "../utils/composables/Page";
import { Logo } from "../utils/helper/UIHelper";
import Loading from "../utils/Loading";

function ForgotPassword() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [organizationCode, setOrganizationCode] = useState("");

  const onReset = () => {
    if (!email) return;

    setIsLoading(true);
    service
      .post("/user/reset-password", {email}, {
      })
      .then(
        (res: any) => {
          setIsLoading(false);
          toast(res.message, { type: "success" });
          navigate("/login");
        },
        () => setIsLoading(false)
      );
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      onReset();
    }
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
                Forgot password.
              </h1>
              <div className="space-y-4 md:space-y-6">
                <div className="text-base font-medium text-gray-900 -mb-2">
                You will receive instructions to reset your password via email.
                </div>

                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={setEmail}
                  placeholder="Your email"
                  onKeyDown={onKeyDown}
                  required
                />

                <button
                  type="submit"
                  className="btn-primary w-full"
                  onClick={onReset}
                >
                  OK
                </button>

                <div className="text-center !mt-3">
                  <Link
                    to="/login"
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-600/80 hover:underline"
                  >
                    Back to the login page.
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Page>
  );
}

export default ForgotPassword;