import { Leaderboard } from './components/Leaderboard';
import { leaderboard } from './data';

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <main className="mx-auto max-w-3xl px-4 py-12">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Leaderboard</h1>
          <p className="mt-1 text-sm text-slate-400">
            Ranked by total score. Trend compares the latest round to the previous one.
          </p>
        </header>
        <Leaderboard players={leaderboard} />
      </main>
    </div>
  );
}

export default App;
