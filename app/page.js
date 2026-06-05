"use client";
import React from "react";

const CATEGORIES = [
  {
    id: "vocab",
    label: "Vocabulary",
    lessons: [
      { id: "food", label: "Food", file: "/lessons/food.csv" },
      { id: "places", label: "Places", file: "/lessons/places.csv" },
      { id: "people", label: "People", file: "/lessons/people.csv" },
      { id: "colors-and-numbers", label: "Colors and Numbers", file: "/lessons/colors-and-numbers.csv" },
      { id: "common-verbs", label: "Common Verbs", file: "/lessons/common-verbs.csv" },
      { id: "adverbs-and-adjectives", label: "Adverbs and Adjectives", file: "/lessons/adverbs-and-adjectives.csv" },
      { id: "tourism", label: "Tourism", file: "/lessons/tourism.csv" },
    ]
  },
  {
    id: "verbs",
    label: "Verb Conjugations",
    lessons: [
      { id: "ser", label: "Ser", file: "/lessons/ser.csv" },
      { id: "estar", label: "Estar", file: "/lessons/estar.csv" },
      { id: "ir", label: "Ir", file: "/lessons/ir.csv" },
    ]
  },
  {
    id: "sentences",
    label: "Sentence Construction",
    lessons: [
      { id: "phrases", label: "Common Phrases", file: "/lessons/common-phrases.csv" },
      { id: "phrases2", label: "Common Phrases 2", file: "/lessons/common-phrases-pt-2.csv" },
      { id: "idioms", label: "Idioms", file: "/lessons/idioms.csv" },
    ]
  }
];

export default function SpanishFlashcards() {
  const [category, setCategory] = React.useState(null);
  const [lesson, setLesson] = React.useState(null);
  const [cards, setCards] = React.useState([]);
  const [masteredCards, setMasteredCards] = React.useState([]);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [showAnswer, setShowAnswer] = React.useState(false);
  const [direction, setDirection] = React.useState("en-es");


  async function loadLesson(file, id) {
    const res = await fetch(file);
    const text = await res.text();

    const lines = text
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    const parsed = [];

    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(",");
      if (parts.length >= 2) {
        parsed.push({
          english: parts[0].replaceAll('"', "").trim(),
          spanish: parts[1].replaceAll('"', "").trim()
        });
      }
    }

    setCards(parsed);
    setMasteredCards([]);
    setLesson(id);
    setCurrentIndex(0);
    setShowAnswer(false);
  }
const activeCards = cards.filter(
  (card) =>
    !masteredCards.includes(`${card.english}-${card.spanish}`)
);
  function nextCard() {
  setShowAnswer(false);
  setCurrentIndex((prev) =>
    activeCards.length ? (prev + 1) % activeCards.length : 0
  );
}

  function previousCard() {
  setShowAnswer(false);
  setCurrentIndex((prev) =>
    activeCards.length
      ? (prev - 1 < 0 ? activeCards.length - 1 : prev - 1)
      : 0
  );
}

  function shuffleCards() {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
    setShowAnswer(false);
  }

  // -------------------------
  // LESSON SELECT SCREEN
  // -------------------------
  if (!category) {
  return (
    <div className="min-h-screen bg-neutral-100 p-4 flex items-center justify-center">
      <div className="w-full max-w-md space-y-4">
        <h1 className="text-3xl font-bold text-center">
          Spanish Flashcards
        </h1>

        <p className="text-center text-neutral-700 text-sm">
          Choose a category
        </p>

        <div className="grid grid-cols-1 gap-3 mt-6">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategory(c)}
              className="bg-black text-white rounded-2xl py-6 text-sm font-semibold active:scale-95 transition"
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
if (category && !lesson) {
  return (
    <div className="min-h-screen bg-neutral-100 p-4 flex items-center justify-center">
      <div className="w-full max-w-md space-y-4">
       <button
  onClick={() => setCategory(null)}
  className="text-sm px-3 py-2 rounded-xl bg-neutral-200"
>
  ← Categories
</button>

        <h1 className="text-2xl font-bold text-center">
          {category.label}
        </h1>

        <p className="text-center text-neutral-700 text-sm">
          Choose a lesson
        </p>

        <div className="grid grid-cols-2 gap-3 mt-6">
          {category.lessons.map((l) => (
            <button
              key={l.id}
              onClick={() => loadLesson(l.file, l.id)}
              className="bg-black text-white rounded-2xl py-5 text-sm font-semibold active:scale-95 transition"
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
const currentCard =
  activeCards.length > 0 ? activeCards[currentIndex] : null;

  // -------------------------
  // FLASHCARD SCREEN
  // -------------------------
  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col">
      
      {/* Header */}
      <div className="p-4 flex justify-between items-center">
       <button
  onClick={() => {
    if (lesson) {
      setLesson(null);
      setCards([]);
      setCurrentIndex(0);
      setShowAnswer(false);
    } else {
      setCategory(null);
    }
  }}
  className="text-sm px-3 py-2 rounded-xl bg-neutral-200"
>
  {lesson ? "← Lessons" : "← Categories"}
</button>
        <button
          onClick={() =>
            setDirection(direction === "en-es" ? "es-en" : "en-es")
          }
          className="text-sm px-3 py-2 rounded-xl bg-neutral-200"
        >
          {direction === "en-es" ? "EN → ES" : "ES → EN"}
        </button>
      </div>

      {/* Card */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div
          onClick={() => setShowAnswer(!showAnswer)}
          className="w-full max-w-md bg-white rounded-3xl shadow-xl min-h-[55vh] flex items-center justify-center text-center p-8 active:scale-[0.99] transition select-none"
        >
          {currentCard ? (
            <div>
              <div className="text-xs uppercase tracking-widest text-neutral-600 mb-6">
                {showAnswer ? "Answer" : "Tap to reveal"}
              </div>

              <div className="text-4xl font-bold leading-tight text-black">
                {!showAnswer
                  ? direction === "en-es"
                    ? currentCard.english
                    : currentCard.spanish
                  : direction === "en-es"
                  ? currentCard.spanish
                  : currentCard.english}
              </div>
            </div>
          ) : (
            <div className="text-neutral-700">No cards found.</div>
          )}
        </div>
      </div>

      {/* Controls (thumb-friendly) */}
<div className="p-4 space-y-3">
  
  <div className="flex justify-between items-center gap-3">
    <button
      onClick={previousCard}
      className="flex-1 py-4 rounded-2xl bg-neutral-200 text-black active:scale-95 transition"
    >
      Previous
    </button>

    <button
      onClick={nextCard}
      className="flex-1 py-4 rounded-2xl bg-black text-white active:scale-95 transition"
    >
      Next
    </button>
  </div>

  <div className="flex justify-between items-center text-sm text-neutral-700">
    <span>
      {activeCards.length ? currentIndex + 1 : 0} / {activeCards.length}
    </span>

    <button
      onClick={shuffleCards}
      className="px-3 py-2 rounded-xl bg-neutral-200 text-black"
    >
      Shuffle
    </button>
  </div>

  {/* NEW MASTERED BUTTON */}
  <button
    onClick={() => {
      const cardId = `${currentCard.english}-${currentCard.spanish}`;

      setMasteredCards((prev) => [...prev, cardId]);
      setShowAnswer(false);
    }}
    className="w-full py-4 rounded-2xl bg-green-200 text-black active:scale-95 transition" 
    >
    Mastered ✓
  </button>
        </div>
      </div>
  );
}