import Image from "next/image";
import MainCalendar from "./components/MainCalendar";

export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="grid grid-cols-5">
        <div className="col-span-1 pl-6 pt-6">
          <div className="border-r border-base-100 h-full">hey</div>
        </div>
          <div className="col-span-4">
            <MainCalendar />
          </div>
      </div>
    </main>
  );
}
