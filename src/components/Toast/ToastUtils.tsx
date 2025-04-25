import { toast } from "react-hot-toast";
import { IoMdClose } from "react-icons/io";

const ToastUtils = {
  success: (message: string, options = { duration: 2000 }) =>
    toast.success(
      <div className="flex items-center gap-2">
        {message}
        <button
          onClick={() => toast.dismiss()}
          className="bg-transparent border-none text-white cursor-pointer"
        >
          <IoMdClose color="black" />
        </button>
      </div>,
      {
        ...options,
      }
    ),

  error: (message: string, options = { duration: 3000 }) =>
    toast.error(
      <div className="flex items-center gap-2">
        {message}
        <button
          onClick={() => toast.dismiss()}
          className="bg-transparent border-none text-white cursor-pointer"
        >
          <IoMdClose color="black" />
        </button>
      </div>,
      {
        ...options,
      }
    ),

  custom: (message: string, color = "blue", options = {}) =>
    toast(
      <div className="flex items-center gap-2">
        {message}
        <button
          onClick={() => toast.dismiss()}
          className="bg-transparent border-none text-white cursor-pointer"
        >
          <IoMdClose color="black" />
        </button>
      </div>,
      {
        style: { background: color, color: "white" },
        ...options,
      }
    ),
};

export default ToastUtils;
