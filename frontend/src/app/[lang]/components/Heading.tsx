interface HeadingProps {
  heading: string;
  description?: string;
}

export default function Heading({ data }: { data: HeadingProps }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 text-center mb-12 pt-2">
      <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">
        {data.heading}
      </h1>
      {!!data.description && (
        <div className="text-slate-600">
          <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
            {data.description}
          </h2>
        </div>
      )}
    </div>
  );
}
