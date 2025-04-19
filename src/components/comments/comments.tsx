"use client";

import { Comments as CommentsProvider } from "@hyvor/hyvor-talk-react";

type CommentsProviderProps = Omit<
  Parameters<typeof CommentsProvider>[0],
  "website-id" | "page-id"
>;

type CommentsProps = {
  slug: string;
} & CommentsProviderProps;

export default function Comments({ slug, ...props }: CommentsProps) {
  return (
    <div className="pt-12" id="hyvor-comments">
      <CommentsProvider
        page-id={slug}
        colors="dark"
        {...props}
        website-id={13075}
      />
    </div>
  );
}
