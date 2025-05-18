'use client';

import React, { useState, useEffect } from 'react';

type Vibe = {
  id: string;
  mood: string;
  note?: string;
  createdAt: string;
};

export default function HomePage() {
  const [mood, setMood] = useState('');
  const [note, setNote] = useState('');
  const [vibes, setVibes] = useState<Vibe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/vibes')
      .then(res => res.json())
      .then(setVibes)
      .catch(() => setError('Failed to load vibes'));
  }, []);

  async function submitVibe(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!mood) {
      setError('Please select a mood');
      return;
    }
    setLoading(true);

    try {
      const res = await fetch('/api/vibes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood, note }),
      });
      if (!res.ok) throw new Error('Failed to submit vibe');

      const newVibe = await res.json();
      setVibes([newVibe, ...vibes]);
      setMood('');
      setNote('');
    } catch {
      setError('Error submitting vibe');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Daily Vibe Tracker</h1>

      <form onSubmit={submitVibe} className="mb-6 space-y-4">
        <label className="block">
          <span className="font-semibold">How are you feeling today?</span>
          <select
            value={mood}
            onChange={e => setMood(e.target.value)}
            className="mt-1 block w-full rounded border-gray-300 shadow-sm"
          >
            <option value="">Select mood</option>
            <option value="😊 Happy">😊 Happy</option>
            <option value="😔 Sad">😔 Sad</option>
            <option value="😠 Angry">😠 Angry</option>
            <option value="😰 Anxious">😰 Anxious</option>
            <option value="😴 Tired">😴 Tired</option>
            <option value="😎 Chill">😎 Chill</option>
          </select>
        </label>

        <label className="block">
          <span className="font-semibold">Add a note (optional)</span>
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            className="mt-1 block w-full rounded border-gray-300 shadow-sm"
            rows={3}
            placeholder="Anything on your mind?"
          />
        </label>

        {error && <p className="text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'Submitting...' : 'Submit Vibe'}
        </button>
      </form>

      <section>
        <h2 className="text-xl font-semibold mb-2">Past Vibes</h2>
        {vibes.length === 0 && <p>No vibes logged yet.</p>}
        <ul className="space-y-3">
          {vibes.map(vibe => (
            <li
              key={vibe.id}
              className="border rounded p-3 shadow-sm bg-white"
            >
              <div className="text-lg">{vibe.mood}</div>
              {vibe.note && <p className="text-gray-600">{vibe.note}</p>}
              <small className="text-gray-400">
                {new Date(vibe.createdAt).toLocaleString()}
              </small>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}  

