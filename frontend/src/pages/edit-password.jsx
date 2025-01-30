import { useState, useRef } from "react";
import { Toast } from "primereact/toast";

import { useNavigate, useParams } from "react-router-dom";

export default function EditPassword() {
  const navigate = useNavigate();
  const toastBC = useRef(null);
  const { id } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const ResetPassowrd = async (e) => {
    e.preventDefault();
    const response = await fetch(
      `https://agyademo.uber.space/api/auth/reset-password/${id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          newPassword,
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
        window.location.href = `/`;
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
      <div className="flex justify-center items-center pt-16 pb-20 mx-4 md:mx-64">
        <div className={`  duration-700 `}>
          <div className=" text-center  flex justify-center items-center">
            <img src="/Logo.png" alt="" className=" w-64" />
          </div>
          <p className=" text-gray-600 text-center my-2 text-lg">
            Edit Password
          </p>
          <form
            onSubmit={ResetPassowrd}
            className="border-sky-600 border p-8 rounded-xl"
          >
            <div className=" relative">
              <input
                type="password"
                placeholder="Enter New Password"
                className="px-2 border-[1px] rounded-xl border-[#ddd] w-[280px] h-10"
                value={newPassword}
                name="email"
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <button className=" text-white rounded-xl py-2 w-[280px] mt-4 hover:bg-main/80 duration-300 bg-main">
              Confirm
            </button>
          </form>
          <a
            className=" mt-4 block text-main cursor-pointer"
            onClick={() => navigate("/")}
          >
            Return to Home Page →
          </a>
        </div>
      </div>
      <Toast ref={toastBC} position="top-right" />
    </>
  );
}
