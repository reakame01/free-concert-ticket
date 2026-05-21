'use client';

import { useAppStore } from '@/context/app-store';

export const HistoryTable = () => {
  const { history } = useAppStore();

  return (
    <div className="mt-6 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-6 py-4 font-semibold text-gray-900">
                Date time
              </th>
              <th className="px-6 py-4 font-semibold text-gray-900">
                Username
              </th>
              <th className="px-6 py-4 font-semibold text-gray-900">
                Concert name
              </th>
              <th className="px-6 py-4 font-semibold text-gray-900">Action</th>
            </tr>
          </thead>
          <tbody>
            {history.map((row, index) => (
              <tr
                key={row.id}
                className={
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50/80'
                }
              >
                <td className="px-6 py-4 text-gray-700">{row.dateTime}</td>
                <td className="px-6 py-4 text-gray-700">{row.username}</td>
                <td className="px-6 py-4 text-gray-700">{row.concertName}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      row.action === 'Cancel'
                        ? 'bg-red-100 text-red-700'
                        : row.action === 'Delete'
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {row.action}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
