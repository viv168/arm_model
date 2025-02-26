"use client"

import Scene from "./scene"

export default function Page() {
  return (
    <div className="h-screen w-screen">
      <div className="h-full w-full">
        <div className="h-full w-full">
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
          <div className="h-[calc(100%-2.5rem)] w-full">
            <Scene />
          </div>
        </div>
      </div>
    </div>
  )
}

