// components/Spinner.tsx
export default function Spinner() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
      <p className="mt-4 text-sm font-medium text-gray-600">Loading page...</p>
    </div>
  );
}