'use client';

import React from 'react';
export default function SpanishFlashcards() {
  const sampleCards = [
    { english: 'the', spanish: 'el / la' },
    { english: 'be', spanish: 'ser / estar' },
    { english: 'house', spanish: 'casa' },
    { english: 'food', spanish: 'comida' },
    { english: 'to walk', spanish: 'caminar' },
  ];

  const [cards, setCards] = React.useState(sampleCards);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [showAnswer, setShowAnswer] = React.useState(false);
  const [direction, setDirection] = React.useState('en-es');
  const [search, setSearch] = React.useState('');

  const filteredCards = cards.filter((card) => {
    const query = search.toLowerCase();
    return (
      card.english.toLowerCase().includes(query) ||
      card.spanish.toLowerCase().includes(query)
    );
  });

  const currentCard = filteredCards[currentIndex] || filteredCards[0];

  React.useEffect(() => {
    setCurrentIndex(0);
  }, [search]);

  function nextCard() {
    setShowAnswer(false);
    setCurrentIndex((prev) =>
      prev + 1 >= filteredCards.length ? 0 : prev + 1
    );
  }

  function previousCard() {
    setShowAnswer(false);
    setCurrentIndex((prev) =>
      prev - 1 < 0 ? filteredCards.length - 1 : prev - 1
    );
  }

  function shuffleCards() {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
    setShowAnswer(false);
  }

  function loadCSV(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target?.result;
      if (!text) return;

      const lines = text
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean);

      const parsed = [];

      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(',');

        if (parts.length >= 2) {
          parsed.push({
            english: parts[0].replaceAll('"', '').trim(),
            spanish: parts[1].replaceAll('"', '').trim(),
          });
        }
      }

      if (parsed.length > 0) {
        setCards(parsed);
        setCurrentIndex(0);
        setShowAnswer(false);
      }
    };

    reader.readAsText(file);
  }

  return (
    <div className="min-h-screen bg-neutral-100 p-4 md:p-8 flex justify-center items-start">
      <div className="w-full max-w-2xl space-y-4">
        <div className="bg-white rounded-3xl shadow-lg p-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold">Spanish Flashcards</h1>
              <p className="text-neutral-500 mt-1">
                Minimalist vocab practice for walks, coffee shops, airports, etc.
              </p>
            </div>

            <label className="cursor-pointer text-sm bg-black text-white px-4 py-2 rounded-2xl text-center">
              Upload CSV
              <input
                type="file"
                accept=".csv"
                onChange={loadCSV}
                className="hidden"
              />
            </label>
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="text"
              placeholder="Search vocab..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 border rounded-2xl px-4 py-3 outline-none"
            />

            <button
              onClick={() =>
                setDirection(direction === 'en-es' ? 'es-en' : 'en-es')
              }
              className="bg-neutral-200 px-4 py-3 rounded-2xl"
            >
              {direction === 'en-es'
                ? 'English → Spanish'
                : 'Spanish → English'}
            </button>

            <button
              onClick={shuffleCards}
              className="bg-neutral-200 px-4 py-3 rounded-2xl"
            >
              Shuffle
            </button>
          </div>
        </div>

        <div
          onClick={() => setShowAnswer(!showAnswer)}
          className="bg-white rounded-[2rem] shadow-xl min-h-[420px] flex flex-col items-center justify-center text-center p-8 cursor-pointer select-none"
        >
          {currentCard ? (
            <>
              <div className="text-sm uppercase tracking-widest text-neutral-400 mb-6">
                {showAnswer ? 'Answer' : 'Prompt'}
              </div>

              <div className="text-4xl md:text-6xl font-semibold leading-tight">
                {!showAnswer
                  ? direction === 'en-es'
                    ? currentCard.english
                    : currentCard.spanish
                  : direction === 'en-es'
                  ? currentCard.spanish
                  : currentCard.english}
              </div>

              <div className="mt-8 text-neutral-400 text-sm">
                Tap card to reveal
              </div>
            </>
          ) : (
            <div className="text-neutral-500">No matching cards.</div>
          )}
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-4 flex items-center justify-between">
          <button
            onClick={previousCard}
            className="px-5 py-3 rounded-2xl bg-neutral-200"
          >
            Previous
          </button>

          <div className="text-sm text-neutral-500">
            {filteredCards.length === 0
              ? '0 cards'
              : `${currentIndex + 1} / ${filteredCards.length}`}
          </div>

          <button
            onClick={nextCard}
            className="px-5 py-3 rounded-2xl bg-black text-white"
          >
            Next
          </button>
        </div>

        <div className="text-center text-sm text-neutral-500 pb-10">
          Tip: upload your CSV file to instantly replace the sample deck.
        </div>
      </div>
    </div>
  );
}
