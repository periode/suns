import { useEffect } from "react";
import { FiCommand, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Logo from "../commons/logo/Logo";

const EntrypointNotFound = () => {
  const navigate = useNavigate();

  //-- this registers ESC to close the modal
  useEffect(() => {
    window.addEventListener("keydown", handleClose);
    return () => {
      window.removeEventListener("keydown", handleClose);
    };
  });

  const handleClose = (e: KeyboardEvent) => {
    if (e.key === "Escape") navigate("/", { replace: true });
  };

  return (
    <>
      <div
        className="absolute z-20 w-full h-full p-4 
                            bg-amber-50/50
                            md:flex md:flex-col md:items-center md:justify-center"
      >
        <div
          className="
                        flex flex-col
                        w-full h-full md:w-[720px] md:h-4/5 
                        border border-stone-500 
                        text-stone-900
                        bg-stone-50
                        "
        >
          <div
            className="w-full flex justify-between flex-col
                                p-4"
          >
            <div className="w-full  flex justify-between items-center">
              <div className="full flex items-center gap-4  ">
                <div className="w-8">
                  <Logo />
                </div>
                <h1 className="text-xl font-bold">Entrypoint Gone</h1>
              </div>

              <div
                className="cursor-pointer"
                onClick={() => navigate("/", { replace: true })}
              >
                <FiX className="text-[32px]" />
              </div>
            </div>
          </div>
          <div className="self-center justify-self-center text-center m-auto flex flex-col items-center gap-4 p-4">
            <p className="text-5xl">We're sorry!</p>
            <p className="">
              We could not find the entrypoint you are trying to access.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default EntrypointNotFound;
