import fs from "fs/promises";
import matter from "gray-matter";
import path from "path";

export async function getContent(fileName: string) {
  const filePath = path.join(process.cwd(), `content/${fileName}`);
  const fileContents = await fs.readFile(filePath, "utf8");
  const { content } = matter(fileContents);

  return content;
}
