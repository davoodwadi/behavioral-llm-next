"use client";

export default function Footer() {
  return (
    <footer className="w-full bg-zinc-50 font-sans dark:bg-black text-gray-500 mt-10">
      <div className="max-w-5xl mx-auto px-6 py-4 text-center text-sm">
        <p className="italic">
          Davood Wadi &amp; Marc Fredette (2025).{" "}
          <span className="font-semibold">
            A Monte-Carlo Sampling Framework For Reliable Evaluation of Large
            Language Models Using Behavioral Analysis.
          </span>{" "}
          In{" "}
          <em>
            The 2025 Conference on Empirical Methods in Natural Language
            Processing
          </em>
          .
        </p>

        <p className="mt-2 text-gray-500">
          &copy; {new Date().getFullYear()} — All rights reserved.
        </p>
      </div>
    </footer>
  );
}
