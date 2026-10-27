import Script from "next/script";

/**
 * Runs before the page is interactive, so the right theme is applied immediately
 * (no white flash for dark-mode visitors).
 *
 * Rule: use the visitor's saved choice if there is one,
 * otherwise follow their device setting (prefers-color-scheme).
 */
const script = `(function(){try{var s=localStorage.getItem("theme");var t=s==="light"||s==="dark"?s:(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");document.documentElement.dataset.theme=t;}catch(e){}})();`;

export default function ThemeScript() {
  return (
    <Script
      id="theme-script"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{ __html: script }}
    />
  );
}