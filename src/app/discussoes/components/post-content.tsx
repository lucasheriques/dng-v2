import { MDXRemote } from "next-mdx-remote/rsc";

export default function PostContent({ content }: { content: string }) {
  return <MDXRemote source={content} />;
}
