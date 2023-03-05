import { useState } from "preact/hooks";
import IconCircleCheck from "tabler-icons/circle-check.tsx";
import IconAlertCircle from "tabler-icons/alert-circle.tsx";
import IconInfoCircle from "tabler-icons/info-circle.tsx";

type InfoModalType = "success" | "info" | "warning" | "error";

interface InfoModalProps {
  show: boolean;
  type: InfoModalType;
  title: string;
  message: string;
  action: string;
}

export default function InfoModal(props: InfoModalProps) {
  const [show, setShow] = useState(props.show);
  const hide = () => setShow(false);

  return (
    <div
      class={`modal modal-bottom sm:modal-middle ${show ? "modal-open" : ""}`}
    >
      <div class="modal-box">
        <h3 class="font-bold text-lg flex items-center">
          <Icon type={props.type} />
          <span>{props.title}</span>
        </h3>
        <p class="py-4">{props.message}</p>
        <div class="modal-action">
          <label
            for="my-modal-6"
            class="btn btn-ghost bg-gray-200"
            onClick={hide}
          >
            {props.action}
          </label>
        </div>
      </div>
    </div>
  );
}

function Icon(props: { type: InfoModalType }) {
  switch (props.type) {
    case "success":
      return (
        <IconCircleCheck class="inline -ml-1.5 mr-1.5 w-10 h-10 fill-green-500 stroke-white" />
      );
    case "info":
      return (
        <IconInfoCircle class="inline -ml-1.5 mr-1.5 w-10 h-10 fill-blue-500 stroke-white" />
      );
    case "warning":
      return (
        <IconAlertCircle class="inline -ml-1.5 mr-1.5 w-10 h-10 fill-yellow-500 stroke-white" />
      );
    case "error":
      return (
        <IconAlertCircle class="inline -ml-1.5 mr-1.5 w-10 h-10 fill-red-500 stroke-white" />
      );
  }
}
