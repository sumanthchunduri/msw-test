import '@/styles/globals.css'
if (process.env.NODE_ENV === "development") {
  require("../mocks");
}

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />
}
