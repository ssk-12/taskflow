import React from 'react';
import { Hand } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg flex items-center gap-4">
        <Hand className="w-8 h-8 text-indigo-500" />
        <h1 className="text-4xl font-bold text-gray-800">Hello</h1>
      </div>
    </div>
  );
}

export default App;