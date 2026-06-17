import { Leaderboard } from './components/Leaderboard';
import { leaderboard } from './data';

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <main className="mx-auto max-w-3xl px-4 py-12">
        <header className="mb-8">
          <h1 className="text-6xl font-bold bg-linear-to-r from-yellow-400 to-sky-500 bg-clip-text text-transparent inline-block">Leaderboard</h1>
          <p className="mt-1 text-sm text-slate-400">
           <strong>Ranked by the selected metric.</strong> Trend compares the latest round to the previous one.
          </p>
        </header>
        <Leaderboard players={leaderboard} />
      </main>
    </div>
  );
}

export default App;
