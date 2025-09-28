// src/components/ConfirmDialog.tsx

import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { X, Check } from 'lucide-react';

type ConfirmDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
};

export const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message }: ConfirmDialogProps) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-[#fcfaf7] p-6 text-left align-middle shadow-xl transition-all border border-[#dcd6c9]">
                <Dialog.Title as="h3" className="text-xl font-serif font-bold leading-6 text-[#2a363b]">
                  {title}
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-600 font-serif">{message}</p>
                </div>

                <div className="mt-6 flex justify-end gap-4">
                  <button type="button" className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50 focus:outline-none" onClick={onClose}>
                    <X className="mr-2 h-4 w-4" /> Cancel
                  </button>
                  <button type="button" className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none" onClick={() => { onConfirm(); onClose(); }}>
                    <Check className="mr-2 h-4 w-4" /> Confirm
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};