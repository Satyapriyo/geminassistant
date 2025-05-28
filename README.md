
---

#  Gemini Assistant – Streaming AI Assistant with Next.js

A **responsive, real-time chatbot interface** powered by the **Google Gemini API**, built with **Next.js 14+**, **Shadcn UI**, and **Tailwind CSS**. Stream AI responses with an elegant, mobile-friendly chat experience.

---

## 🚀 Features

* 💬 **Modern Chat UI**: Clean layout with user and AI message bubbles
* 🔁 **Streaming Responses**: Real-time token-by-token AI output
* 🌙 **Dark / Light Mode** toggle (with theme persistence)
* 📱 **Mobile-Responsive**: Fully responsive design
* ✂️ **Copy Messages**: Easily copy AI responses
* 🧠 **Chat History Management**: Clear and manage conversations
* ⚡ **Typing Indicators** & Loading animations

---

## 🎯 Objective

Build a rich chatbot UI powered by Google Gemini API with live-streaming AI responses, using a modern web stack and best practices in API integration, styling, and performance.

---

## 🧰 Tech Stack

| Tool                      | Purpose                                  |
| ------------------------- | ---------------------------------------- |
| **Next.js 14+**           | Fullstack framework (App Router)         |
| **@google/generative-ai** | Gemini API integration                   |
| **Shadcn UI**             | UI components (Buttons, Sheets, Dialogs) |
| **Tailwind CSS**          | Utility-first styling                    |
| **Next.js API Routes**    | Server logic & Gemini API proxy          |

---

## 📂 Project Structure (Highlights)

```
src/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── chat.tsx
│   ├── loading-animation.tsx
│   ├── markdown-message.tsx
│   ├── sidebar.tsx
│   ├── sidebarContent.tsx
│   ├── theme-provider.tsx
│   ├── theme-toggle.tsx
│   └── typing-animation.tsx
│
│   └── ui/
│       └── input.tsx
│
├── lib/
│   └── utils.ts
│
├── store/
│   └── chatStore.ts

```

---

## 📦 Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/gemini-chatbot.git
cd gemini-chatbot
```

### 2. Install Dependencies

```bash
pnpm install
# or
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file:

```bash
GOOGLE_API_KEY=your_google_api_key_here
```

### 4. Run the Dev Server

```bash
pnpm dev
# or
npm run dev
```



## 🌐 Live Demo

> [![Vercel](https://vercel.com/button)](https://your-vercel-link.vercel.app)

---




## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first.

---


