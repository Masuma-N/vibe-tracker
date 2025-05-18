'use client';

import React, { useState, useEffect } from 'react';

type Vibe = {
  id: string;
  mood: string;
  note?: string;
  createdAt: string;
};
type Goal = {
  id: string;
  text: string;
  completed: boolean;
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

  const [goals, setGoals] = useState<Goal[]>([]);
  const [goalText, setGoalText] = useState('');
  const [goalError, setGoalError] = useState('');

  useEffect(() => {
    fetch('/api/goals')
      .then(res => res.json())
      .then(setGoals)
      .catch(() => setGoalError('Failed to load goals'));
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
    <main className="max-w-xl mx-auto p-4 min-h-screen bg-blue-100 text-black">

      <h1 className="text-3xl font-bold mb-4">Daily Vibe Tracker</h1>

      <form onSubmit={submitVibe} className="mb-6 space-y-4">
        <label className="block">
          <span className="font-semibold text-black">How are you feeling today?</span>
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
              className="border rounded p-3 shadow-sm bg-gray-100 text-black"
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
      <section className="mt-10">
  <h2 className="text-xl font-semibold mb-2">Your Goals</h2>

  <form
    onSubmit={async (e) => {
      e.preventDefault();
      setGoalError('');
      if (!goalText.trim()) {
        setGoalError('Goal text is required');
        return;
      }

      try {
        const res = await fetch('/api/goals', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: goalText }),
        });

        if (!res.ok) throw new Error('Failed to add goal');

        const newGoal = await res.json();
        setGoals([newGoal, ...goals]);
        setGoalText('');
      } catch {
        setGoalError('Error submitting goal');
      }
    }}
    className="space-y-4 mb-6"
  >
    <input
      type="text"
      value={goalText}
      onChange={(e) => setGoalText(e.target.value)}
      placeholder="Enter a new goal"
      className="w-full border rounded px-3 py-2"
    />
    {goalError && <p className="text-red-500">{goalError}</p>}
    <button
      type="submit"
      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
    >
      Add Goal
    </button>
  </form>

  <ul className="space-y-3">
    {goals.map(goal => (
      <li
        key={goal.id}
        className="border rounded p-3 shadow-sm bg-white text-black flex justify-between items-center"
      >
        <span>{goal.text}</span>
        {goal.completed && <span className="text-green-500 font-semibold">✓</span>}
      </li>
    ))}
  </ul>
</section> 

    </main>
  );
}  

