"use client";

import { useState } from "react";
import { generateQuestions } from "@/actions/generateQuestions";

export default function QuizPage() {
  const [questions, setQuestions] = useState([]);
  const [technology, setTechnology] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerateQuestions = async () => {
    setLoading(true);
    setQuestions([]);

    const generatedQuestions = await generateQuestions(
      technology,
      experienceLevel,
    );
    setQuestions(generatedQuestions);
  };

  return (
    <div className="quiz-page">
      <h1>Developer Quiz</h1>
      <div className="form">
        <label>
          Select Technology:
          <input
            type="text"
            value={technology}
            onChange={(e) => setTechnology(e.target.value)}
            placeholder="e.g., JavaScript"
          />
        </label>
        <label>
          Select Experience Level:
          <select
            value={experienceLevel}
            onChange={(e) => setExperienceLevel(e.target.value)}
          >
            <option value="">Select...</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </label>
        <button onClick={handleGenerateQuestions} disabled={loading}>
          {loading ? "Generating..." : "Generate Questions"}
        </button>
      </div>
      {questions.length > 0 && (
        <ul className="questions">
          {questions.map((q, index) => (
            <li key={index}>
              <h3>{q.question}</h3>
              <ul>
                {q.options.map((option: string, idx: number) => (
                  <li key={idx}>{option}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
