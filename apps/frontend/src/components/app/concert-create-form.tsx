'use client';

import { Save, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAppStore } from '@/context/app-store';

export const ConcertCreateForm = () => {
  const router = useRouter();
  const { addConcert } = useAppStore();
  const [name, setName] = useState('');
  const [totalSeats, setTotalSeats] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const seats = parseInt(totalSeats, 10);
    if (!name.trim() || !description.trim() || Number.isNaN(seats) || seats <= 0) {
      toast.error('Please fill in all fields correctly');
      return;
    }

    addConcert({
      name: name.trim(),
      description: description.trim(),
      totalSeats: seats,
    });

    toast.success('Create successfully');
    setName('');
    setTotalSeats('');
    setDescription('');
    router.push('/home');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
    >
      <h2 className="text-xl font-bold text-[#2196F3]">Create</h2>
      <div className="mt-4 border-b border-gray-200" />

      <div className="mt-6 space-y-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="concert-name"
              className="mb-2 block text-sm font-semibold text-gray-900"
            >
              Concert Name
            </label>
            <input
              id="concert-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Please input concert name"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
              required
            />
          </div>

          <div>
            <label
              htmlFor="total-seats"
              className="mb-2 block text-sm font-semibold text-gray-900"
            >
              Total of seat
            </label>
            <div className="relative">
              <input
                id="total-seats"
                type="number"
                min={1}
                value={totalSeats}
                onChange={(e) => setTotalSeats(e.target.value)}
                placeholder="500"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 text-gray-900 placeholder:text-gray-400 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                required
              />
              <User
                className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                strokeWidth={1.5}
              />
            </div>
          </div>
        </div>

        <div>
          <label
            htmlFor="description"
            className="mb-2 block text-sm font-semibold text-gray-900"
          >
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Please input description"
            rows={5}
            className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
            required
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-lg bg-[#2196F3] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
        >
          <Save className="h-5 w-5" strokeWidth={1.5} />
          Save
        </button>
      </div>
    </form>
  );
};
