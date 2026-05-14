'use client';

import { useState } from 'react';

interface ErrorToastProps {
  message: string;
  onClose: () => void;
}

export default function ErrorToast({ message, onClose }: ErrorToastProps) {
  return (
    <div className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded shadow-lg">
      {message}
      <button onClick={onClose} className="ml-4">X</button>
    </div>
  );
}