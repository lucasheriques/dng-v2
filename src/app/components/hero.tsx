"use client";

import { AnimatedStat } from "@/app/components/animated-stat";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SOCIALS } from "@/lib/constants";
import { motion } from "framer-motion";
import { ArrowRight, Link2, Rocket } from "lucide-react";
import Link from "next/link";

const AnimatedText = ({
  text,
  delay = 0,
  className = "",
}: {
  text: string;
  delay?: number;
  className?: string;
}) => {
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((word, index) => (
        <motion.span
          key={index}
          className="inline-block"
          initial={{ opacity: 0, filter: "blur(10px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{
            opacity: { delay: delay + index * 0.05, duration: 0.3 },
            filter: { delay: delay + index * 0.05 + 0.3, duration: 0.3 },
          }}
        >
          {word}
          {index < words.length - 1 && "\u00A0"}
        </motion.span>
      ))}
    </span>
  );
};

export default function Hero() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 pt-24 relative z-10">
      <Badge
        variant="outline"
        className="border-[#5CFFE1]/30 text-[#5CFFE1] mb-6 backdrop-blur-sm motion-delay-[500ms] motion-preset-fade"
      >
        <Link2 className="mr-2 h-4 w-4" />
        <Link
          href="https://www.linkedin.com/feed/update/urn:li:activity:7257725748344438784?commentUrn=urn%3Ali%3Acomment%3A%28activity%3A7257725748344438784%2C7257748302866071552%29&replyUrn=urn%3Ali%3Acomment%3A%28activity%3A7257725748344438784%2C7257751314724491264%29&dashCommentUrn=urn%3Ali%3Afsd_comment%3A%287257748302866071552%2Curn%3Ali%3Aactivity%3A7257725748344438784%29&dashReplyUrn=urn%3Ali%3Afsd_comment%3A%287257751314724491264%2Curn%3Ali%3Aactivity%3A7257725748344438784%29"
          target="_blank"
          className="motion-preset-typewriter-[42] motion-duration-[10s]"
        >
          prometo que não tô vendendo nenhuma ilusão
        </Link>
      </Badge>
      <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
        <AnimatedText text="Do Brasil para o" delay={0.3} />
        <br />
        <motion.span
          initial={{ opacity: 0, filter: "blur(10px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{
            opacity: { delay: 0.9, duration: 0.3 },
            filter: { delay: 0.9, duration: 0.3 },
          }}
          className="bg-gradient-to-r from-primary via-yellow-400 to-accent-secondary text-transparent bg-clip-text inline-block animate-gradient"
        >
          mundo inteiro
        </motion.span>
      </h1>
      <h2 className="text-xl text-slate-200 mb-8 max-w-2xl">
        <AnimatedText
          text="Sua jornada como dev não precisa ter fronteiras. Junte-se a uma comunidade de desenvolvedores brasileiros que estão conquistando oportunidades globais e crescendo juntos."
          delay={0.9}
        />
      </h2>
      <motion.div
        className="flex flex-col sm:flex-row gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 2.1 }} // Delayed to appear after text
      >
        <Button size="xl" asChild className="min-w-80">
          <Link
            href={`${SOCIALS.newsletter}/subscribe?ref=nagringa.dev`}
            className="focus:outline-dotted"
          >
            Participe da mentoria
            <Rocket className="ml-2 h-5 w-5 group-hover:motion-translate-x-in-[-134%] group-hover:motion-translate-y-in-[164%] group-hover:h-8 group-hover:w-8" />
          </Link>
        </Button>
        <Button variant="outline" size="xl" asChild className="min-w-80">
          <Link
            href={`${SOCIALS.newsletter}?ref=nagringa.dev`}
            className="focus:outline-dotted"
          >
            Veja minha newsletter
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </motion.div>

      {/* Stats */}
      <motion.div
        className="mt-16 flex justify-center items-center border-t border-white/10 pt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl w-full">
          <AnimatedStat
            value={1150}
            label="inscritos na newsletter"
            color="text-primary"
          />
          <AnimatedStat
            value={150}
            label="membros na comunidade"
            color="text-yellow-400"
          />
          <AnimatedStat
            value={20}
            label="assinantes da mentoria"
            color="text-[#FF4B8C]"
          />
        </div>
      </motion.div>
    </div>
  );
}
