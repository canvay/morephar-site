import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface RichTextProps {
  content: string;
}

export default function RichText({ content }: RichTextProps) {
  // TODO: STYLE THE MARKDOWN
  return (
    <section className="rich-text py-6 dark:bg-black dark:text-gray-50 ">
      <Markdown children={content} remarkPlugins={[remarkGfm]} />
    </section>
  );
}
