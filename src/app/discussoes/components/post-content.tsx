export default function PostContent({ content }: { content: string }) {
  console.log("is this on the server?", content);
  return <div>{content}</div>;
}
