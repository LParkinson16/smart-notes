"use client"

import React from 'react';
import { useEffect, useState } from "react";
import { fetchNotes, addNote, deleteNote, updateNote, summariseNote } from "../utils/api";

export default function Home() {

  interface notes {
    title: string,
    content: string
  };

  const [notes, setNotes] = useState<notes[]>([])
  const [title, setTitle] = useState<string>("")
  const [content, setContent] = useState<string>("")

  const getNotes = async () => {
    try {
      setNotes(await fetchNotes())
    } catch (e) {
      console.error(e)
    }
  };

  useEffect(() => {
    getNotes();
  }, []);

  const handleAddNote = async (title: string, content: string) => {
    try {
      await addNote(title, content);
      getNotes();

      setTitle("")
      setContent("")
    } catch (e) {
      console.error(e)
    }
  };

  const handleUpdateNote = async (id: number) => {
    try {
      await updateNote(id, title, content);
      getNotes()

      setTitle("")
      setContent("")
    } catch (e) {
      console.error(e)
    }
  };

  const handleDeleteNote = async (id: number) => {
    try {
      await deleteNote(id);
      getNotes()
    } catch (e) {
      console.error(e)
    }
  };

  const handleSummarise = async (content: string) => {
    try {
      const summary = await summariseNote(content)
      alert(summary)
    } catch (e) {
      console.error("unable to summarise: \n", e)
    }
  }


  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100">
      <div className="fixed top-0 left-0 right-0 bg-white shadow-md z-10 flex flex-col items-center justify-center p-6">
        <header className="text-3xl font-bold text-blue-600 mb-2">Smart Notes</header>
        <h1 className="text-xl text-gray-800 mb-2">Add a new note</h1>
        <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-4">
          <input
            type="text"
            placeholder="Note title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 mb-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <input
            type="text"
            placeholder="Note content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 mb-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={() => handleAddNote(title, content)}
            className="w-full py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200 cursor-pointer"
          >
            Create Note
          </button>
        </div>
      </div>

      <div className="w-full pt-80 h-full overflow-y-auto grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 p-4">
        {notes?.map((note: any) => (
          <div
            key={note.id}
            className="relative bg-yellow-100 shadow-lg rounded-md p-4 w-80 h-60 transform rotate-1 hover:rotate-0 transition duration-200"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">{note.title}</h2>
            <p className="text-gray-600 mb-4">{note.content}</p>
            <div className="absolute bottom-2 left-2 right-2 flex justify-between">
              <button
                onClick={() => handleUpdateNote(note.id)}
                className="px-2 py-1 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition duration-200"
              >
                Update
              </button>
              <button
                onClick={() => handleSummarise(note.content)}
                className="px-2 py-1 bg-green-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition duration-200"
              >
                summarise (AI)
              </button>
              <button
                onClick={() => handleDeleteNote(note.id)}
                className="px-2 py-1 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

}
