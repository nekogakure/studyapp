"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import Header from "../../components/header";
import { currentDatabaseID, fetchQuestions } from "@/features/questionsData";
import Message from "@/components/message";

const Questions = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const blockID = searchParams.get("blockID");

    const [questions, setQuestions] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [message, setMessage] = useState("");

    const refresh = () => {
        console.log("refresh");
        fetchQuestions(currentDatabaseID, blockID, false).then((data) => {
            setQuestions(data);
            console.log("refreshed");　// 出てくる
            setMessage("データを再読み込みしました！"); // なぜか出てこない
        });
    };

    useEffect(() => {
        fetchQuestions(currentDatabaseID, blockID).then((data) => {
            setQuestions(data);
        });
    }, [blockID]);

    const handleToggleAnswer = () => {
        setShowAnswer(!showAnswer);
    };

    const handleNextQuestion = () => {
        setCurrentQuestionIndex((prevIndex) => (prevIndex + 1) % questions.length);
        setShowAnswer(false);
    };

    const handlePrevQuestion = () => {
        setCurrentQuestionIndex((prevIndex) => (prevIndex - 1 + questions.length) % questions.length);
        setShowAnswer(false);
    };

    if (!questions) {
        return <p>読み込み中...</p>;
    }

    if (questions.length === 0) {
        return <p className="text-xl">問題がありません。</p>;
    }

    const currentQuestion = questions[currentQuestionIndex];

    return (
        <>
            <div className="p-4 bg-white rounded shadow-md">
                <p className="text-lg font-semibold mb-2">ID: {currentQuestion.id}</p>
                <div className="cursor-pointer mb-4 min-h-24 lg:min-h-8">
                    <p className="text-xl">{currentQuestion.question}</p>
                </div>
                <button className="p-4 border border-gray-300 rounded-md text-left hover:bg-gray-50 w-full" onClick={handleToggleAnswer}>
                    <p className={`${showAnswer && "text-green-600"} p-1`}>{showAnswer ? currentQuestion.answer : "答えを表示"}</p>
                </button>
                <div className="flex justify-between space-x-4 mt-4">
                    <button className="px-8 py-2 bg-blue-500 text-white rounded hover:bg-blue-700" onClick={handlePrevQuestion}>前の問題</button>
                    <button className="px-8 py-2 bg-blue-500 text-white rounded hover:bg-blue-700" onClick={handleNextQuestion}>次の問題</button>
                </div>
            </div>
            <button className="px-8 py-2 bg-red-500 text-white rounded hover:bg-red-700 self-start" onClick={() => refresh()}>キャッシュなしで再読み込み</button>
            <Message text={message} className="bg-green-300" />
        </>
    );
}

export default function Main() {
    return (
        <div className="flex flex-col min-h-screen lg:px-8">
            <Header />
            <main className="flex flex-col justify-between p-8 lg:p-24 gap-8">
                <h1 className="text-4xl font-bold">問題</h1>
                <Suspense fallback={<div>読み込み中...</div>}>
                    <Questions />
                </Suspense>
                <button className="px-8 py-2 bg-gray-500 text-white rounded hover:bg-gray-700 self-start" onClick={() => window.history.back()}>戻る</button>
            </main>
        </div>
    );
}
