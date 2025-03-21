import { FaCircleCheck } from "react-icons/fa6";
import { IoClose, IoCloseCircle } from "react-icons/io5";
import { PiWarningCircleFill } from "react-icons/pi";
import { toast, ToastOptions } from "react-toastify";

export type ToastStatus = 'success' | 'error' | 'warning';

export interface AppToastProps {
  title?: string;
  message?: string;
}

const defaultOptions: ToastOptions = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "light",
  closeButton: false,
  className: "!p-0 !shadow-none !bg-transparent",
}

export const useAppToast = (hookOption?: { toastid: string }) => {
  const apptoast = ({
    success: ({ title, message }: AppToastProps) =>
      toast(
        <CustomToast
          type={'success'}
          title={title}
          message={message}
          onClose={() => { toast.dismiss() }}
        />,
        { ...defaultOptions, toastId: hookOption?.toastid, }
      ),
    error: ({ title, message }: AppToastProps) => toast(
      <CustomToast
        type={'error'}
        title={title}
        message={message}
        onClose={() => { toast.dismiss() }}
      />,
      { ...defaultOptions, toastId: hookOption?.toastid, }
    ),
    warning: ({ title, message }: AppToastProps) => toast(
      <CustomToast
        type={'warning'}
        title={title}
        message={message}
        onClose={() => { toast.dismiss() }}
      />,
      { ...defaultOptions, toastId: hookOption?.toastid, }
    )
  })

  return {
    apptoast
  }
}


export const AppToast = {
  success: (props: AppToastProps, hookOption?: { toastid: string }) => {
    toast(
      <CustomToast
        type={'success'}
        title={props.title}
        message={props.message}
        onClose={() => { toast.dismiss() }}
      />,
      { ...defaultOptions, toastId: hookOption?.toastid, }
    )
  },
  error: (props: AppToastProps, hookOption?: { toastid: string }) => {
    toast(
      <CustomToast
        type={'error'}
        title={props.title}
        message={props.message}
        onClose={() => { toast.dismiss() }}
      />,
      { ...defaultOptions, toastId: hookOption?.toastid, }
    )
  },
  warning: (props: AppToastProps, hookOption?: { toastid: string }) => {
    toast(
      <CustomToast
        type={'warning'}
        title={props.title}
        message={props.message}
        onClose={() => { toast.dismiss() }}
      />,
      { ...defaultOptions, toastId: hookOption?.toastid, }
    )
  }
}



const CustomToast = ({ type, message, title, onClose }: {
  type: ToastStatus,
  title?: string,
  message?: string,
  onClose?: () => void
}) => {
  const typeStyles = {
    success: {
      background: 'bg-green-50',
      border: 'border-green-600',
      icon: FaCircleCheck,
      iconStyle: 'text-green-600 border-green-200 bg-green-50'
    },
    error: {
      background: 'bg-red-50',
      border: 'border-red-700',
      icon: IoCloseCircle,
      iconStyle: 'text-red-600 border-red-200 bg-red-50'
    },
    warning: {
      background: 'bg-yellow-50',
      border: 'border-yellow-700',
      icon: PiWarningCircleFill,
      iconStyle: 'text-amber-600 border-amber-200 bg-amber-50'
    }
  };

  const { border, icon: Icon, iconStyle } = typeStyles[type];

  return (
    <div className={`w-full px-4 py-3 rounded-sm bg-white shadow-md border-l-[6px] ${border} flex gap-x-2`}>
      <div className={`border border-${iconStyle} bg-${iconStyle} rounded-lg min-w-[24px] h-[24px] flex items-center justify-center`}>
        <Icon className={iconStyle} size={10} />
      </div>
      <div className="space-y-0">
        {title && <p className="text-base font-bold text-black">{title}</p>}
        {message && <p className="text-sm font-medium">{message}</p>}
      </div>
      <div className="border-r border-gray-200 w-px flex-grow" />
      <div>
        <button onClick={onClose} className="cursor-pointer">
          <IoClose />
        </button>
      </div>
    </div>
  );
};