import Link from "next/link";
import Image from "next/image";

export default function Logo({
  src,
  children,
}: {
  src: string | null;
  children?: React.ReactNode;
}) {
  return (
    <Link
      href="/"
      aria-label="Back to homepage"
    >
      {src && <Image src={src} alt="logo" width={128} height={72} />}
      <div className="ml-2">{children}</div>
    </Link>
  );
}
