"use client";

import React, { useState } from 'react';
import { ChevronUp, ChevronDown, Search } from 'lucide-react';

export function SidebarFilter() {
  return (
    <aside className="w-64 shrink-0 hidden lg:block select-none bg-white border border-gray-100 rounded-2xl p-4 shadow-sm h-fit sticky top-24">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
        <h2 className="text-[17px] font-extrabold text-[#061842]">Filters</h2>
        <button className="text-[12px] font-bold text-[#1668F6] hover:underline">
          Clear All
        </button>
      </div>

      {/* CATEGORIES */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3 cursor-pointer group">
          <h3 className="text-[12px] font-bold text-[#061842] tracking-wider">CATEGORIES</h3>
          <ChevronUp className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
        </div>
        <div className="space-y-2.5">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300 text-[#1668F6] focus:ring-[#1668F6]" />
            <span className="text-[13px] text-[#1E293B] font-medium group-hover:text-[#1668F6]">T-Shirts <span className="text-gray-400 font-normal ml-1">(12,456)</span></span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#1668F6] focus:ring-[#1668F6]" />
            <span className="text-[13px] text-[#475569] font-medium group-hover:text-[#1668F6]">Polo T-shirts <span className="text-gray-400 font-normal ml-1">(3,240)</span></span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#1668F6] focus:ring-[#1668F6]" />
            <span className="text-[13px] text-[#475569] font-medium group-hover:text-[#1668F6]">Round Neck <span className="text-gray-400 font-normal ml-1">(4,521)</span></span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#1668F6] focus:ring-[#1668F6]" />
            <span className="text-[13px] text-[#475569] font-medium group-hover:text-[#1668F6]">V Neck <span className="text-gray-400 font-normal ml-1">(2,340)</span></span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#1668F6] focus:ring-[#1668F6]" />
            <span className="text-[13px] text-[#475569] font-medium group-hover:text-[#1668F6]">Printed <span className="text-gray-400 font-normal ml-1">(6,210)</span></span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#1668F6] focus:ring-[#1668F6]" />
            <span className="text-[13px] text-[#475569] font-medium group-hover:text-[#1668F6]">Striped <span className="text-gray-400 font-normal ml-1">(1,982)</span></span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#1668F6] focus:ring-[#1668F6]" />
            <span className="text-[13px] text-[#475569] font-medium group-hover:text-[#1668F6]">Full Sleeve <span className="text-gray-400 font-normal ml-1">(2,104)</span></span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#1668F6] focus:ring-[#1668F6]" />
            <span className="text-[13px] text-[#475569] font-medium group-hover:text-[#1668F6]">Oversized <span className="text-gray-400 font-normal ml-1">(1,540)</span></span>
          </label>
        </div>
        <button className="text-[13px] font-bold text-[#1668F6] mt-3 hover:underline text-left">
          + Show More
        </button>
      </div>

      <div className="h-px bg-gray-100 w-full mb-6"></div>

      {/* BRAND */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[12px] font-bold text-[#061842] tracking-wider">BRAND</h3>
          <button className="text-gray-400 hover:text-gray-600 bg-gray-50 rounded-full p-1.5">
            <Search className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="space-y-2.5">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#1668F6] focus:ring-[#1668F6]" />
            <span className="text-[13px] text-[#475569] font-medium group-hover:text-[#1668F6]">U.S. Polo Assn. <span className="text-gray-400 font-normal ml-1">(1,245)</span></span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#1668F6] focus:ring-[#1668F6]" />
            <span className="text-[13px] text-[#475569] font-medium group-hover:text-[#1668F6]">Levi's <span className="text-gray-400 font-normal ml-1">(980)</span></span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#1668F6] focus:ring-[#1668F6]" />
            <span className="text-[13px] text-[#475569] font-medium group-hover:text-[#1668F6]">Puma <span className="text-gray-400 font-normal ml-1">(876)</span></span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#1668F6] focus:ring-[#1668F6]" />
            <span className="text-[13px] text-[#475569] font-medium group-hover:text-[#1668F6]">Nike <span className="text-gray-400 font-normal ml-1">(1,120)</span></span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#1668F6] focus:ring-[#1668F6]" />
            <span className="text-[13px] text-[#475569] font-medium group-hover:text-[#1668F6]">Adidas <span className="text-gray-400 font-normal ml-1">(1,430)</span></span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#1668F6] focus:ring-[#1668F6]" />
            <span className="text-[13px] text-[#475569] font-medium group-hover:text-[#1668F6]">Roadster <span className="text-gray-400 font-normal ml-1">(965)</span></span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#1668F6] focus:ring-[#1668F6]" />
            <span className="text-[13px] text-[#475569] font-medium group-hover:text-[#1668F6]">HRX <span className="text-gray-400 font-normal ml-1">(743)</span></span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#1668F6] focus:ring-[#1668F6]" />
            <span className="text-[13px] text-[#475569] font-medium group-hover:text-[#1668F6]">The Souled Store <span className="text-gray-400 font-normal ml-1">(689)</span></span>
          </label>
        </div>
        <button className="text-[13px] font-bold text-[#1668F6] mt-3 hover:underline text-left">
          + Show More
        </button>
      </div>

      <div className="h-px bg-gray-100 w-full mb-6"></div>

      {/* PRICE */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4 cursor-pointer group">
          <h3 className="text-[12px] font-bold text-[#061842] tracking-wider">PRICE</h3>
          <ChevronUp className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
        </div>
        
        {/* Simple visual slider representation */}
        <div className="px-1 mb-2">
          <div className="relative w-full h-1 bg-gray-200 rounded-full">
            <div className="absolute top-0 left-0 h-full w-[80%] bg-[#1668F6] rounded-full"></div>
            <div className="absolute top-1/2 -translate-y-1/2 left-0 w-3.5 h-3.5 bg-[#1668F6] border-2 border-white rounded-full shadow-sm cursor-pointer"></div>
            <div className="absolute top-1/2 -translate-y-1/2 left-[80%] w-3.5 h-3.5 bg-[#1668F6] border-2 border-white rounded-full shadow-sm cursor-pointer -ml-1"></div>
          </div>
        </div>
        <div className="text-[13px] font-bold text-[#1E293B] mt-3">
          ₹100 - ₹10,000+
        </div>
      </div>

      <div className="h-px bg-gray-100 w-full mb-6"></div>

      {/* COLOR */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3 cursor-pointer group">
          <h3 className="text-[12px] font-bold text-[#061842] tracking-wider">COLOR</h3>
          <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
        </div>
        <div className="flex flex-wrap gap-2.5 mt-4">
          <button className="w-5 h-5 rounded-full bg-black ring-1 ring-offset-1 ring-gray-200" aria-label="Black"></button>
          <button className="w-5 h-5 rounded-full bg-white border border-gray-300 ring-1 ring-offset-1 ring-transparent hover:ring-gray-200" aria-label="White"></button>
          <button className="w-5 h-5 rounded-full bg-blue-600 ring-1 ring-offset-1 ring-transparent hover:ring-gray-200" aria-label="Blue"></button>
          <button className="w-5 h-5 rounded-full bg-green-700 ring-1 ring-offset-1 ring-transparent hover:ring-gray-200" aria-label="Green"></button>
          <button className="w-5 h-5 rounded-full bg-[#1e3a8a] ring-1 ring-offset-1 ring-transparent hover:ring-gray-200" aria-label="Navy"></button>
          <button className="w-5 h-5 rounded-full bg-gray-400 ring-1 ring-offset-1 ring-transparent hover:ring-gray-200" aria-label="Grey"></button>
          <button className="w-5 h-5 rounded-full bg-red-600 ring-1 ring-offset-1 ring-transparent hover:ring-gray-200" aria-label="Red"></button>
          <button className="w-5 h-5 rounded-full bg-orange-500 ring-1 ring-offset-1 ring-transparent hover:ring-gray-200" aria-label="Orange"></button>
          <button className="text-[12px] font-bold text-[#1668F6] ml-1 hover:underline">
            + More
          </button>
        </div>
      </div>

      <div className="h-px bg-gray-100 w-full mb-6"></div>

      {/* DISCOUNT RANGE */}
      <div>
        <div className="flex items-center justify-between cursor-pointer group">
          <h3 className="text-[12px] font-bold text-[#061842] tracking-wider">DISCOUNT RANGE</h3>
          <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
        </div>
      </div>
    </aside>
  );
}
