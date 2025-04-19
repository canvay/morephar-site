import Logo from "./Logo";

export default function Footer({
  logoUrl,
  logoText,
}: {
  logoUrl: string | null;
  logoText: string | null;
}) {
  return (
    <footer className="p-6 text-white bg-black pb-12">
      <div className="max-w-[1400px] m-auto p-6 flex justify-between gap-2">
        <div>
          <p className="scroll-m-20 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
            {logoText}
          </p>
          <p>A leader in providing innovative production</p>
        </div>

        <div className="flex items-end justify-center flex-col gap-1 text-secondary text-sm">
          <p>© 2025 morephar.com All Rights Reserved.</p>
          <p>Powered by next.js</p>
        </div>
      </div>
    </footer>
  );
}
