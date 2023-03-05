import { useState } from "preact/hooks";

interface InfoModalProps {
  show: boolean;
  info: string;
  confirm: string;
}

export default function InfoModal(props: InfoModalProps) {
  const [show, setShow] = useState(props.show);
  const hide = () => setShow(false);

  return (
    <div
      id="popup-modal"
      tabIndex={-1}
      class={`bg-white/50 fixed top-0 left-0 right-0 z-50 p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-modal md:h-full ${
        show ? "" : "hidden"
      }`}
    >
      <div class="relative w-full h-full max-w-md mx-auto">
        <div class="relative bg-white rounded-lg shadow">
          <div class="p-6 text-center">
            <svg
              aria-hidden="true"
              class="mx-auto mb-4 text-red-500 w-14 h-14"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              >
              </path>
            </svg>
            <h3 class="mb-5 text-lg font-normal">
              {props.info}
            </h3>
            <button
              onClick={hide}
              data-modal-hide="popup-modal"
              type="button"
              class="text-blue-600 bg-gray-200 hover:bg-gray-300 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm inline-flex justify-center items-center px-5 py-2.5 text-center min-w-[50%]"
            >
              {props.confirm}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
