"use client";

import dynamic from "next/dynamic";

const Comments = dynamic(() => import("./comments"));

export default Comments;
