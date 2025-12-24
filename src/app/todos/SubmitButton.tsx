'use client';

import { useFormStatus } from 'react-dom';

export default function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`px-6 py-3 rounded-lg font-medium transition text-white
        ${pending ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}
      `}
    >
      {pending ? 'Loading' : 'ADD'}
    </button>
  );
}
