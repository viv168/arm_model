"use client"

import Scene from "./scene"

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-200 p-8">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-lg bg-white shadow-lg">
          {/* Browser Chrome */}
          <div className="flex items-center border-b border-gray-200 px-4 py-2">
            <div className="flex space-x-2">
              <div className="h-3 w-3 rounded-full bg-red-500"></div>
              <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
              <div className="h-3 w-3 rounded-full bg-green-500"></div>
            </div>
            <div className="ml-auto flex space-x-2">
              <div className="h-3 w-3 rounded-full bg-gray-200"></div>
              <div className="h-3 w-3 rounded-full bg-gray-200"></div>
              <div className="h-3 w-3 rounded-full bg-gray-200"></div>
            </div>
          </div>
          {/* 3D Scene */}
          <div className="h-[600px] w-full">
            <Scene />
          </div>
        </div>
      </div>
    </div>
  )
}

