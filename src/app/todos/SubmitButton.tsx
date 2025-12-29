'use client';

export default function SubmitButton({ isPanding }: { isPanding: boolean }) {
  return (
    <button
      type="submit"
      disabled={isPanding}
      className={`px-6 py-3 rounded-lg font-medium transition text-white
        ${isPanding ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}
      `}
    >
      {isPanding ? 'Loading' : 'ADD'}
    </button>
  );
}
