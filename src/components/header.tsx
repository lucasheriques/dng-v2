"use client";
import { Search } from "@/components/search";
import { Button } from "@/components/ui/button";
import { MENTORSHIP_LINKS, SOCIALS, TOOLS } from "@/lib/constants";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { ChevronDown, Mail, PhoneCall } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import Logo from "../../public/logo-v2-no-bg.webp";

import { UserDropdown } from "@/components/user-dropdown";
import { Article } from "@/lib/types";
import { cn } from "@/lib/utils";
import { SiDiscord, SiYoutube } from "@icons-pack/react-simple-icons";
import { usePathname } from "next/navigation";

dayjs.locale("pt-br");

const comunidade = [
  ...Object.values(TOOLS),
  { title: "Newsletter", href: SOCIALS.newsletter, icon: Mail },
  { title: "YouTube", href: SOCIALS.youtube, icon: SiYoutube },
  { title: "Discord", href: SOCIALS.discord, icon: SiDiscord },
  { title: "Fale comigo", href: SOCIALS.calendar, icon: PhoneCall },
];

interface HeaderProps {
  articles: Article[];
}

export default function Header({ articles }: HeaderProps) {
  const pathname = usePathname();

  if (pathname.includes("/guias")) {
    return null;
  }

  return (
    <Popover
      className="z-50 backdrop-blur-xs bg-slate-950/25 shadow-lg sticky top-0 w-full border-b border-slate-800/20"
      as="header"
    >
      {({ close }) => (
        <>
          <div
            className={cn(
              "py-2 w-full relative flex items-center justify-between container"
            )}
          >
            <Link href="/" className="items-center gap-2 flex">
              <Image src={Logo} alt="Dev na Gringa" width={48} height={48} />
              <span className="font-bold text-xl hidden md:block">
                Dev na Gringa
              </span>
            </Link>
            <div className="flex items-center gap-x-3">
              <Button variant="link" asChild className="text-main-text px-0">
                <PopoverButton className="focus:outline-primary focus:outline-2 focus:outline-offset-2">
                  Menu
                  <ChevronDown aria-hidden="true" className="h-5 w-5" />
                </PopoverButton>
              </Button>
              <Button variant="link" asChild className="px-0 hidden sm:block">
                <Link href="/assinantes">Recursos para assinantes</Link>
              </Button>
              <Search />
              <UserDropdown />
            </div>
          </div>

          <PopoverPanel
            transition
            className={cn(
              "absolute inset-x-0 top-0 -z-10 bg-slate-900 pt-16 shadow-2xl ring-1 ring-slate-500/30 transition data-closed:-translate-y-1 data-closed:opacity-0 data-enter:duration-200 data-leave:duration-150 data-enter:ease-out data-leave:ease-in max-h-[calc(100vh-4rem)] overflow-y-auto"
            )}
          >
            <div
              className={cn(
                "relative mx-auto grid grid-cols-1 gap-x-8 gap-y-10 px-6 py-10 lg:grid-cols-2 max-w-7xl",
                "lg:px-8"
              )}
            >
              <div className="grid gap-y-4 sm:grid-cols-2 gap-x-6 sm:gap-x-8">
                <div>
                  <h3 className="text-sm/6 font-medium text-tertiary-text">
                    Comunidade e ferramentas
                  </h3>
                  <div className="mt-6 flow-root">
                    <div className="-my-2">
                      {comunidade.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="flex gap-x-4 py-2 text-sm/6 font-semibold hover:transition-all hover:bg-white/5 px-3 -mx-3 rounded-lg group"
                          onClick={close}
                          prefetch={true}
                        >
                          <item.icon
                            aria-hidden="true"
                            className="size-6 flex-none text-tertiary-text group-hover:text-main-text transition-colors"
                          />
                          {item.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm/6 font-medium text-tertiary-text">
                    Links para assinantes
                  </h3>
                  <div className="mt-6 flow-root">
                    <div className="-my-2">
                      {Object.values(MENTORSHIP_LINKS).map((item) => (
                        <a
                          key={item.href}
                          href={item.href}
                          className="flex gap-x-4 py-2 text-sm/6 font-semibold hover:transition-all hover:bg-white/5 px-3 -mx-3 rounded-lg group"
                          target="_blank"
                        >
                          <item.icon
                            aria-hidden="true"
                            className="size-6 flex-none text-tertiary-text group-hover:text-main-text transition-colors"
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
                {articles.map((post) => (
                  <article
                    key={post.id}
                    className="relative isolate flex max-w-2xl flex-col gap-x-8 gap-y-6 sm:flex-row sm:items-start lg:flex-col lg:items-stretch group"
                  >
                    <div className="relative flex-none">
                      <Image
                        alt={post.title}
                        width={280}
                        height={180}
                        src={post.coverImage ?? "https://picsum.photos/280/180"}
                        className="aspect-2/1 w-full rounded-xl bg-gray-800 object-cover sm:aspect-16/9 sm:h-32 lg:h-auto shadow-lg transition-transform group-hover:scale-[1.02]"
                      />
                      <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-700/50 group-hover:ring-gray-700 transition-colors" />
                    </div>
                    <div>
                      <div className="flex items-center gap-x-4">
                        <time
                          dateTime={post.postDate}
                          className="text-sm/6 text-tertiary-text"
                        >
                          {dayjs(post.postDate).format("MMM. D, YYYY")}
                        </time>
                        <a
                          href={`${SOCIALS.newsletter}/t/${post.postTags?.[0]?.slug}`}
                          className="relative z-10 rounded-full bg-slate-800/50 backdrop-blur-sm px-3 py-1.5 text-xs font-medium text-secondary-text hover:bg-slate-700 transition-colors"
                        >
                          {post.postTags?.[0]?.name}
                        </a>
                      </div>
                      <h4 className="mt-2 text-sm/6 font-semibold group-hover:text-primary transition-colors">
                        <a href={post.canonical_url}>
                          <span className="absolute inset-0" />
                          {post.title}
                        </a>
                      </h4>
                      <p className="mt-2 text-sm/6 text-tertiary-text group-hover:text-main-text transition-colors">
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
