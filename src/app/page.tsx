import Chat from '@/components/chat';
import { Sidebar } from '@/components/sidebar';

export default function Home() {
  return (
    <main className="min-h-screen bg-background flex">
      <Sidebar />
      <div className="flex-1">
        <div className="container mx-auto py-8">
          <h1 className="text-3xl font-bold text-center mb-8 dark:text-white text-black">
            <span className="bg-gradient-to-r from-violet-500 to-background bg-clip-text text-transparent">
              Gemini
            </span>{' '}
            Assistant
          </h1>
          <Chat />
        </div>
      </div>
    </main>
  );
}
