import React, { useState } from "react";
import PhoneInput from "react-phone-input-2";
import OtpInput from "otp-input-react";
import { CgSpinner } from "react-icons/cg";
import { auth } from "./firebase.config";
import "react-phone-input-2/lib/style.css";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { toast, Toaster } from "react-hot-toast";
import { BsFillShieldLockFill, BsTelephoneFill } from "react-icons/bs";
const App = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(true);
  const [ph, setPh] = useState("");
  const [user, setUser] = useState(null);

  function onCaptchVerify() {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            onSignup();
          },
          "expired-callback": () => {},
        },
        auth
      );
    }
  }
  function onSignup() {
    setLoading(true);
    onCaptchVerify();

    const appVerifier = window.recaptchaVerifier;

    const formatPh = "+" + ph;

    signInWithPhoneNumber(auth, formatPh, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        setLoading(false);
        setShowOTP(true);
        console.log("otp gyo tara bap ne");
        toast.success("OTP sended successfully!");
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }

  function onOTPVerify() {
    setLoading(true);
    window.confirmationResult
      .confirm(otp)
      .then(async (res) => {
        console.log(res);
        setUser(res.user);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }

  return (
    <div className="bg-[#234E70] h-screen flex items-center justify-center">
      <Toaster toastOptions={{ duration: 4000 }} />
      <div id="recaptcha-container"></div>

      {user ? (
        <>
          <h2 className="text-center h-screen w-screen bg-[#317773] text-black font-medium text-2xl flex items-center justify-center">
            👍Login Success
          </h2>
        </>
      ) : (
        <>
          <div
            className={`w-[500px] h-[500px] ${
              showOTP ? "bg-green-500" : "bg-[#E7E8D1]"
            } rounded-md flex items-center justify-center`}
          >
            <div>
              {showOTP ? (
                <>
                  <h1 className="text-center leading-normal capitalize text-3xl font-thin bg-[#A7BEAE] my-2">
                    Please Fillup your otp
                  </h1>
                  <h2 className="mx-[10px]">
                    5 minutes valid....
                    <br /> the user's OTP app and the authentication server rely
                    on shared secrets. Values for one-time passwords are
                    generated using the Hashed Message Authentication Code
                    (HMAC) algorithm and a moving factor, such as time-based
                    information (TOTP) or an event counter (HOTP).
                  </h2>

                  <div className="bg-emerald-200 text-emerald-500 w-fit mx-auto p-4 rounded-full">
                    <BsFillShieldLockFill size={30} />
                  </div>
                  <label
                    htmlFor="otp"
                    className="text-center flex justify-center font-extralight text-2xl"
                  >
                    Enter your OTP
                  </label>
                  <div className="w-[400px] h-[200px] ml-9 p-5">
                    <OtpInput
                      value={otp}
                      onChange={setOtp}
                      OTPLength={6}
                      otpType="number"
                      disabled={false}
                      autoFocus
                      className="opt-container my-2"
                    ></OtpInput>
                    <button
                      onClick={onOTPVerify}
                      className="bg-emerald-600 hover:bg-emerald-700 w-full flex gap-1 items-center justify-center py-2.5 text-white rounded"
                    >
                      {loading && (
                        <CgSpinner size={20} className="mt-1 animate-spin" />
                      )}
                      <span>Verify OTP</span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h1 className="text-center leading-normal capitalize text-3xl font-thin bg-[#A7BEAE]">
                    otp verification
                  </h1>
                  <h2 className="mx-[10px] underline">
                    In OTP-based authentication methods,
                    <br /> the user's OTP app and the authentication server rely
                    on shared secrets. Values for one-time passwords are
                    generated using the Hashed Message Authentication Code
                    (HMAC) algorithm and a moving factor, such as time-based
                    information (TOTP) or an event counter (HOTP).
                  </h2>
                  <div className="bg-emerald-200 text-emerald-500 w-fit mx-auto p-4 rounded-full">
                    <BsTelephoneFill size={30} />
                  </div>
                  <label
                    htmlFor=""
                    className="font-thin p-[130px] m-2 text-xl text-black text-center"
                  >
                    Verify your phone number
                  </label>
                  <div className="w-[400px] h-[200px] ml-9 p-1">
                    <PhoneInput country={"in"} value={ph} onChange={setPh} />
                    <button
                      onClick={onSignup}
                      className="bg-green-800 hover:bg-green-700 w-full flex gap-1 items-center justify-center my-5 py-2.5 text-white rounded"
                    >
                      {loading && (
                        <CgSpinner size={20} className="mt-1 animate-spin" />
                      )}
                      <span>Send code via SMS</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
