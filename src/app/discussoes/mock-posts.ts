import { Post } from "./types";
export const mockPosts: Post[] = [
  {
    id: 1,
    title:
      "Quais são as melhores estratégias de teste para aplicativos móveis em grandes empresas de tecnologia?",
    votes: 28,
    author: {
      name: "Ana Silva",
      role: "Engenheira de Software Senior",
      company: "Nubank",
      level: "Senior",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    createdAt: new Date("2024-12-20T10:00:00"),
    viewCount: 11700,
    commentCount: 4,
  },
  {
    id: 2,
    title:
      "Ajuda necessária: Primeiro emprego como dev júnior está muito devagar - Próximos passos?",
    votes: 31,
    author: {
      name: "Pedro Santos",
      role: "Engenheiro Júnior",
      company: "Itaú",
      level: "Junior",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    createdAt: new Date("2024-12-19T15:30:00"),
    viewCount: 8000,
    commentCount: 5,
  },
  {
    id: 3,
    title: "Como conseguir um trabalho remoto em empresas internacionais?",
    votes: 14,
    author: {
      name: "Mariana Costa",
      role: "Engenheira de Software Pleno",
      company: "iFood",
      level: "Pleno",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    createdAt: new Date("2024-12-18T09:15:00"),
    viewCount: 8000,
    commentCount: 2,
  },
];

export const mockFilters = {
  levels: [
    "Estagiário",
    "Júnior",
    "Pleno",
    "Sênior",
    "Staff Engineer",
    "Tech Lead",
  ],
  companies: ["Nubank", "iFood", "Itaú", "PagSeguro", "Stone", "Mercado Livre"],
  tags: [
    "Desenvolvimento Web",
    "Mobile",
    "DevOps",
    "Machine Learning",
    "Arquitetura",
    "Carreira",
  ],
};
