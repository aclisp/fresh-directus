import { useState } from "preact/hooks";

interface InfoModalProps {
  show: boolean;
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
        <h3 class="font-bold text-lg">{props.title}</h3>
        <p class="py-4">{props.message}</p>
        <div class="modal-action">
          <label for="my-modal-6" class="btn" onClick={hide}>
            {props.action}
          </label>
        </div>
      </div>
    </div>
  );
}
