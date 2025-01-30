import { useState, useRef, useEffect } from "react";
import { Toast } from "primereact/toast";

import CountdownTimer from "../components/countDown/index";
export default function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [message, setMessage] = useState("reset password ");
  const [timer, setTimer] = useState(false);
  const toastBC = useRef(null);

  const [popup, setPopup] = useState(false);
  const [otp, setOtp] = useState(new Array(4).fill(""));
  const [activeOTPIndex, setActiveOTPIndex] = useState(0);
  let currentOTPIndex = 0;
  const inputRef = useRef(null);

  const disabledButton = () => {
    setDisabled(true);
    setTimeout(() => {
      setDisabled(false);
    }, 60000);
  };

  const handleOnChange = ({ target }) => {
    const { value } = target;
    const newOTP = [...otp];
    newOTP[currentOTPIndex] = value.substring(value.length - 1);

    if (!value) setActiveOTPIndex(currentOTPIndex - 1);
    else setActiveOTPIndex(currentOTPIndex + 1);

    setOtp(newOTP);
  };

  const handleOnKeyDown = (e, index) => {
    currentOTPIndex = index;
    if (e.key === "Backspace") setActiveOTPIndex(currentOTPIndex - 1);
  };
  useEffect(() => {
    inputRef.current?.focus();
  }, [activeOTPIndex, inputRef]);
  const SendOTB = async (e) => {
    e.preventDefault();
    const response = await fetch(
      "https://agyademo.uber.space/api/otp/sendOTP",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          message,
        }),
      }
    );
    const finalData = await response.json();
    if (finalData.success) {
      toastBC.current.show({
        severity: "success",
        summary: finalData.message,
        sticky: true,
      });
      setPopup(true);
    } else {
      toastBC.current.show({
        severity: "error",
        summary: finalData.message,
        sticky: true,
      });
      setPopup(false);
    }
  };
  const notReceived = async (e) => {
    e.preventDefault();
    const response = await fetch(
      "https://agyademo.uber.space/api/otp/sendOTP",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          message,
        }),
      }
    );
    const finalData = await response.json();
    if (finalData.success) {
      setTimer(true);
      toastBC.current.show({
        severity: "success",
        summary: finalData.message,
        sticky: true,
      });
      disabledButton();
    } else {
      toastBC.current.show({
        severity: "error",
        summary: finalData.message,
        sticky: true,
      });
      disabledButton();
    }
  };
  const VerifyOTP = async (e) => {
    e.preventDefault();
    const response = await fetch(
      "https://agyademo.uber.space/api/otp/verifyOTP",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          otp: otp.join(""),
        }),
      }
    );
    const finalData = await response.json();
    if (finalData.success) {
      toastBC.current.show({
        severity: "success",
        summary: finalData.message,
        sticky: true,
      });
      setTimeout(() => {
        window.location.href = `/edit-password/${finalData.user._id}`;
      }, 500);
    } else {
      toastBC.current.show({
        severity: "error",
        summary: finalData.message,
        sticky: true,
      });
    }
  };
  return (
    <>
      <div className="flex justify-center items-center pt-52 pb-20 mx-4 md:mx-64 mt-[-100px]">
        <div className={`  duration-700 `}>
          <div className=" text-center  flex justify-center items-center">
            <img src="Logo.png" alt="" className=" w-52" />
          </div>
          <p className=" text-gray-600 text-center my-2 text-lg">
            Edit Password
          </p>
          <form
            onSubmit={SendOTB}
            className="border-main border p-8 rounded-xl"
          >
            <div className=" relative">
              <span className=" absolute top-1/2 translate-y-[-50%] pl-1"></span>
              <input
                type="email"
                placeholder=" Enter your email "
                className="px-2 rounded-xl border-[1px] border-[#ddd] w-[280px] h-10"
                value={email}
                name="email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <span className=" block text-red-600"></span>
            <button className=" text-white py-2 w-[280px] rounded-xl mt-4 hover:bg-main/80 duration-500 bg-main">
              Send
            </button>
          </form>
          <a className=" mt-4 block text-sky-700 cursor-pointer">
            Return to Home Page →
          </a>
        </div>
      </div>
      {popup === true ? (
        <div
          className={
            "absolute top-0  w-full bg-gray-200/80 h-screen flex justify-center items-center flex-col"
          }
        >
          <div className="bg-white p-16 flex justify-center items-center flex-col rounded-xl mt-24">
            <div className=" text-center  flex justify-center items-center">
              <img src="Logo.png" alt="" className=" w-52 mb-4" />
            </div>
            <h3> Enter OTP </h3>
            <p className=" text-gray-500 my-3 text-md w-64 ml-10">
              the otp has sended to your email
            </p>
            <form onSubmit={VerifyOTP}>
              <div className="flex space-x-2 justify-center items-center">
                {otp.map((_, index) => {
                  return (
                    <div key={index}>
                      <input
                        ref={activeOTPIndex === index ? inputRef : null}
                        type="number"
                        className={
                          "w-12 h-12 border-2 rounded bg-transparent outline-none text-center font-semibold text-xl spin-button-none border-gray-400 focus:border-gray-700 focus:text-gray-700 text-gray-400 transition"
                        }
                        onChange={handleOnChange}
                        onKeyDown={(e) => handleOnKeyDown(e, index)}
                        value={otp[index]}
                      />
                      {index === otp.length - 1 ? null : (
                        <span className={"w-2 py-0.5 bg-gray-400"} />
                      )}
                    </div>
                  );
                })}
              </div>
              {timer === true ? (
                <>
                  <CountdownTimer
                    minutes={1}
                    text=" : You can send the OTP again"
                  />
                </>
              ) : null}
              <button className=" text-white py-2 w-[250px] mt-4 hover:bg-main/80 duration-300 bg-main rounded-lg">
                Confirm
              </button>
            </form>
            <button
              className="text-center block mx-auto my-2 text-main hover:opacity-60 duration-300 cursor-pointer disabled:opacity-60 disabled:pointer-events-none"
              onClick={notReceived}
              disabled={disabled}
            >
              Resend the OTP
            </button>
          </div>
        </div>
      ) : null}
      <Toast ref={toastBC} position="top-right" />
    </>
  );
}
