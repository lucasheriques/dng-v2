"use client";
import { Search } from "@/components/search";
import { Button } from "@/components/ui/button";
import { MENTORSHIP_LINKS, SOCIALS } from "@/lib/constants";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import {
  ChevronDown,
  CircleDollarSign,
  Globe2,
  Mail,
  PhoneCall,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { useScrollDirection } from "@/hooks/use-scroll-direction";
import { SiDiscord, SiYoutube } from "@icons-pack/react-simple-icons";

const comunidade = [
  {
    name: "Calculadora de Salário CLT vs PJ",
    href: "/calculadora-clt-vs-pj",
    icon: CircleDollarSign,
  },
  { name: "Newsletter", href: SOCIALS.newsletter, icon: Mail },
  { name: "YouTube", href: SOCIALS.youtube, icon: SiYoutube },
  { name: "Discord", href: SOCIALS.discord, icon: SiDiscord },
  { name: "Fale comigo", href: SOCIALS.calendar, icon: PhoneCall },
];

const recentPosts = [
  {
    id: 1,
    title: "Design documents e RFCs",
    href: "https://newsletter.nagringa.dev/p/design-docs-e-rfcs",
    date: "Out 30, 2024",
    datetime: "2024-10-30",
    category: {
      title: "Eng. de Software",
      href: "https://newsletter.nagringa.dev/t/engenharia-de-software",
    },
    imageUrl:
      "https://substackcdn.com/image/fetch/w_1456,c_limit,f_webp,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F949ef4b3-51fa-4e50-94c7-2a13ee0f9bdd_2912x1632.png",
    description:
      "Como fazer documentação técnica que realmente ajude você, seu time e também sua carreira.",
  },
  {
    id: 2,
    title: "Por que trabalhar na Brex?",
    href: "https://newsletter.nagringa.dev/p/por-que-trabalhar-na-brex",
    date: "Out 14, 2024",
    datetime: "2024-10-14",
    category: {
      title: "Carreira",
      href: "https://newsletter.nagringa.dev/t/carreira",
    },
    imageUrl:
      "https://substackcdn.com/image/fetch/f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fcefc7411-08d2-4c46-8ce4-1fb430bd4484_910x855.png",
    description:
      "A Brex é uma fintech fundada por dois brasileiros em 2017. Venha descobrir os meus principais motivos para trabalhar aqui.",
  },
];

export default function Header() {
  const isScrollingUp = useScrollDirection();

  return (
    <Popover
      className={`z-50 backdrop-blur-sm bg-slate-950/25 shadow-lg fixed top-0 w-full motion-preset-slide-down border-b border-slate-800/20 transition-transform duration-300 ${
        isScrollingUp ? "translate-y-0" : "-translate-y-full"
      }`}
      as="header"
    >
      {({ close }) => (
        <>
          <div className="py-4 mx-auto max-w-7xl w-full px-4 relative flex items-center justify-between">
            <Link href="/" className="items-center gap-2 flex">
              <Globe2 className="h-6 w-6 text-[#5CFFE1]" />
              <span className="font-bold text-white text-xl">
                Dev na Gringa
              </span>
            </Link>
            <div className="flex items-center gap-x-1 sm:gap-x-2">
              <Search />
              <Button
                variant="link"
                asChild
                className="text-white px-0 text-base"
              >
                <PopoverButton className="focus:outline focus:outline-primary focus:outline-2 focus:outline-offset-2">
                  Menu
                  <ChevronDown aria-hidden="true" className="h-5 w-5" />
                </PopoverButton>
              </Button>
            </div>
          </div>

          <PopoverPanel
            transition
            className="absolute inset-x-0 top-0 -z-10 bg-slate-900 pt-16 shadow-2xl ring-1 ring-slate-500/30 transition data-[closed]:-translate-y-1 data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-150 data-[enter]:ease-out data-[leave]:ease-in max-h-[calc(100vh-4rem)] overflow-y-auto"
          >
            <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-6 py-10 lg:grid-cols-2 lg:px-8">
              <div className="grid gap-y-4 sm:grid-cols-2 gap-x-6 sm:gap-x-8">
                <div>
                  <h3 className="text-sm/6 font-medium text-gray-400">
                    Comunidade e conteúdo
                  </h3>
                  <div className="mt-6 flow-root">
                    <div className="-my-2">
                      {comunidade.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="flex gap-x-4 py-2 text-sm/6 font-semibold text-gray-200 hover:text-white transition-all hover:bg-white/5 px-3 -mx-3 rounded-lg group"
                          onClick={close}
                          prefetch={true}
                        >
                          <item.icon
                            aria-hidden="true"
                            className="h-6 w-6 flex-none text-gray-500 group-hover:text-gray-300 transition-colors"
                          />
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm/6 font-medium text-gray-400">
                    Recursos da mentoria
                  </h3>
                  <div className="mt-6 flow-root">
                    <div className="-my-2">
                      {Object.values(MENTORSHIP_LINKS).map((item) => (
                        <a
                          key={item.href}
                          href={item.href}
                          className="flex gap-x-4 py-2 text-sm/6 font-semibold text-gray-200 hover:text-white transition-all hover:bg-white/5 px-3 -mx-3 rounded-lg group"
                          target="_blank"
                        >
                          <item.icon
                            aria-hidden="true"
                            className="h-6 w-6 flex-none text-gray-500 group-hover:text-gray-300 transition-colors"
                          />
                          {item.title}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-10 sm:gap-8 lg:grid-cols-2">
                <h3 className="sr-only">Recent posts</h3>
                {recentPosts.map((post) => (
                  <article
                    key={post.id}
                    className="relative isolate flex max-w-2xl flex-col gap-x-8 gap-y-6 sm:flex-row sm:items-start lg:flex-col lg:items-stretch group"
                  >
                    <div className="relative flex-none">
                      <Image
                        alt={post.title}
                        width={280}
                        height={180}
                        src={post.imageUrl}
                        className="aspect-[2/1] w-full rounded-xl bg-gray-800 object-cover sm:aspect-[16/9] sm:h-32 lg:h-auto shadow-lg transition-transform group-hover:scale-[1.02]"
                      />
                      <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-700/50 group-hover:ring-gray-700 transition-colors" />
                    </div>
                    <div>
                      <div className="flex items-center gap-x-4">
                        <time
                          dateTime={post.datetime}
                          className="text-sm/6 text-gray-400"
                        >
                          {post.date}
                        </time>
                        <a
                          href={post.category.href}
                          className="relative z-10 rounded-full bg-slate-800/50 backdrop-blur px-3 py-1.5 text-xs font-medium text-gray-300 hover:bg-slate-700 transition-colors"
                        >
                          {post.category.title}
                        </a>
                      </div>
                      <h4 className="mt-2 text-sm/6 font-semibold text-gray-200 group-hover:text-white transition-colors">
                        <a href={post.href}>
                          <span className="absolute inset-0" />
                          {post.title}
                        </a>
                      </h4>
                      <p className="mt-2 text-sm/6 text-gray-400 group-hover:text-gray-300 transition-colors">
                        {post.description}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </PopoverPanel>
        </>
      )}
    </Popover>
  );
}
