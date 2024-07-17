import Image from "next/image";
import MainCalendar from "./components/MainCalendar";
import { Search } from "react-feather";

export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="grid grid-cols-5">
        <div className="col-span-1 pl-6 pt-6">
          <div className="border-r border-base-100 h-full px-8 pt-4 pb-7">
            <div className="border border-gray-400 rounded h-full p-4">
              <label className="input input-bordered flex items-center gap-2">
                <input type="text" className="grow" placeholder="Search events..." />
                <Search />
              </label>
            </div>
          </div>
        </div>
        <div className="col-span-4">
          <MainCalendar />
        </div>
      </div>
    </main>
  );
}
