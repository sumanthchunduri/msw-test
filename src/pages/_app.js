import '@/styles/globals.css'
import { server } from "../mocks/browser";

if (process.env.NODE_ENV === "development") {
  // require("../mocks");
  server.listen();
}

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />
}
