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
    // Toggle goal completion
  async function toggleGoalCompletion(id: string, completed: boolean) {
    try {
      const res = await fetch(`/api/goals?id=${id}`, { 
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !completed }),
      });

      if (!res.ok) throw new Error('Toggle failed');

      const updated = await res.json();
      setGoals(goals.map(g => (g.id === id ? updated : g)));
    } catch (err) {
      console.error('Toggle error:', err);
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
  <li key={vibe.id} className="border rounded p-3 shadow-sm bg-gray-100 text-black flex justify-between">
    <div>
      <div className="text-lg">{vibe.mood}</div>
      {vibe.note && <p className="text-gray-600">{vibe.note}</p>}
      <small className="text-gray-400">
        {new Date(vibe.createdAt).toLocaleString()}
      </small>
    </div> 
    <button
      onClick={async () => {
        try {
          const res = await fetch(`/api/vibes?id=${vibe.id}`, {
            method: 'DELETE',
          });
          if (!res.ok) throw new Error('Delete failed');
          setVibes(vibes.filter(v => v.id !== vibe.id));
        } catch (err) {
          console.error('Vibe delete error:', err);
        }
      }}
      className="text-red-500 text-sm hover:underline ml-4"
    >
      🗑️
    </button>
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
      className="border rounded p-3 shadow-sm bg-white text-black flex items-center justify-between"
    >
      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          checked={goal.completed}
          onChange={() => toggleGoalCompletion(goal.id, goal.completed)}
        />
        <span className={goal.completed ? 'line-through text-gray-500' : ''}>
          {goal.text}
        </span>
      </div>

      <button
        onClick={async () => {
          try {
            const res = await fetch(`/api/goals?id=${goal.id}`, {
              method: 'DELETE',
            });
            if (!res.ok) throw new Error('Delete failed');
            setGoals(goals.filter(g => g.id !== goal.id));
          } catch (err) {
            console.error('Delete error:', err);
          }
        }}
        className="text-red-500 text-sm hover:underline"
      >
        🗑️
      </button>
    </li>
  ))} 
</ul>

</section> 

    </main>
  );
}   

