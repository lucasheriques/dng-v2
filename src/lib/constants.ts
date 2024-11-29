import {
  SiDiscord,
  SiLinkedin,
  SiX,
  SiYoutube,
} from "@icons-pack/react-simple-icons";
import {
  Calendar,
  FileText,
  History as HistoryIcon,
  Newspaper,
  Target,
  UserPlus,
} from "lucide-react";

import ArticleList from "@/lib/article-list.json";

export const MOST_POPULAR_ARTICLES = ArticleList.sort(
  (a, b) => b.views - a.views
);

export const SOCIALS = {
  newsletter: "https://newsletter.nagringa.dev",
  discord: "https://discord.gg/KfMwzN839v",
  github: "https://github.com/lucasheriques/",
  linkedin: "https://www.linkedin.com/in/lucas-faria/",
  twitter: "https://twitter.com/onelucasfaria",
  instagram: "https://www.instagram.com/lucasfaria.dev/",
  tiktok: "https://tiktok.com/@lucasfaria.dev",
  devTo: "https://dev.to/lucasheriques",
  tabNews: "https://www.tabnews.com.br/lucasfaria",
  reddit: "https://reddit.com/u/fanzika",
  youtube: "https://www.youtube.com/@LucasFariaDev",
  email: "mailto:hi@lucasfaria.dev",
  resume: "https://cv.lucasfaria.dev",
  calendar: "https://cal.com/lucasfaria",
  personalWebsite: "https://lucasfaria.dev",
};

export const SOCIAL_LINKS = {
  newsletter: {
    title: "Newsletter",
    href: SOCIALS.newsletter,
    icon: Newspaper,
  },
  discord: {
    title: "Discord",
    href: SOCIALS.discord,
    icon: SiDiscord,
  },
  bookCall: {
    title: "Converse comigo",
    href: SOCIALS.calendar,
    icon: Calendar,
  },
  youtube: {
    title: "YouTube",
    href: SOCIALS.youtube,
    icon: SiYoutube,
  },
  linkedin: {
    title: "Linkedin",
    href: SOCIALS.linkedin,
    icon: SiLinkedin,
  },
  x: {
    title: "X/Twitter",
    href: SOCIALS.twitter,
    icon: SiX,
  },
};

export const MENTORSHIP_LINKS = {
  joinMentorship: {
    title: "Participe da mentoria",
    href: `${SOCIALS.newsletter}/subscribe?ref=nagringa.dev`,
    icon: UserPlus,
  },
  pastMentorings: {
    title: "Mentorias passadas",
    href: "https://mentoria.nagringa.dev",
    icon: HistoryIcon,
  },
  monthlyGoals: {
    title: "Metas do mês",
    href: "https://metas.nagringa.dev",
    icon: Target,
  },
  eventsCalendar: {
    title: "Calendário de eventos",
    href: "https://calendario.nagringa.dev/",
    icon: Calendar,
  },
  allResources: {
    title: "Todos os recursos",
    href: "https://drive.nagringa.dev",
    icon: FileText,
  },
};

export const POPULAR_ARTICLES = [
  {
    link: "https://newsletter.nagringa.dev/p/os-maiores-salarios-do-brasil-para",
    title: "Os maiores salários do Brasil para engenheiros de software",
    description:
      "Entenda porque existem tanta diferença entre salários de empresas, e o modelo trimodal de salários para engenheiros de software.",
    readingTime: "7min",
    views: "4000",
  },
  {
    link: "https://newsletter.nagringa.dev/p/dev-na-gringa-contratacao-impostos-hardware",
    title: "Dev na Gringa: contratação, impostos, hardware e começando do zero",
    description:
      "Como foi a questão burocrática no meu trabalho pra fora desde 2020. E o que eu faria se estivesse começando do zero.",
    readingTime: "9min",
    views: "1000",
  },
  {
    link: "https://newsletter.nagringa.dev/p/processo-seletivo-vagas-engenharia-de-software-na-brex",
    title: "O processo seletivo para vagas de engenharia de software na Brex",
    description:
      "Todas as etapas do processo seletivo para vagas de engenharia de software na Brex, o que esperar em cada uma delas, e como se preparar.",
    readingTime: "11min",
    views: "1500",
  },
  {
    link: "https://newsletter.nagringa.dev/p/como-eu-virei-um-dev-na-gringa",
    title: "Dev na Gringa: Como Encontrar Vagas e Salários",
    description:
      "Como eu me tornei um dev na gringa. Onde encontrar vagas, salários, e conhecimentos necessários.",
    readingTime: "6min",
    views: "2000",
  },
];
