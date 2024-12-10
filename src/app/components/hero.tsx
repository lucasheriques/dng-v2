import { AnimatedStat } from "@/app/components/animated-stat";
import AnimatedText from "@/app/components/animated-text";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SOCIALS } from "@/lib/constants";
import { ArrowRight, Link2, Rocket } from "lucide-react";
import Link from "next/link";
import Balancer from "react-wrap-balancer";

export default function Hero() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 relative z-10 space-y-4 md:space-y-8">
      <div>
        <Badge
          variant="outline"
          className="border-primary/30 text-primary backdrop-blur-sm motion-delay-[500ms] motion-preset-fade"
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
        <h1 className="font-bold text-white text-3xl md:text-4xl">
          <Balancer>
            <AnimatedText text="De Dev no Brasil" delay={0.3} />
            <br />
            <AnimatedText
              text="a Dev Internacional"
              separatedWords={false}
              delay={15}
              className="bg-gradient-to-r from-primary via-yellow-400 to-accent-secondary text-transparent bg-clip-text inline-block animate-gradient text-4xl md:text-5xl"
            />
          </Balancer>
        </h1>
      </div>
      <h2 className="text-xl text-slate-200 max-w-2xl">
        <Balancer>
          <AnimatedText
            text="Junte-se a +1300 devs brasileiros aprendendo, compartilhando experiências e construindo carreiras internacionais juntos."
            delay={0.9}
          />
        </Balancer>
      </h2>
      <div className="flex flex-col sm:flex-row gap-4 motion-preset-fade motion-preset-slide-up motion-duration-300 motion-delay-[2s]">
        <div className="flex flex-col gap-1">
          <Button size="xl" asChild className="min-w-80">
            <Link href={`${SOCIALS.newsletter}/subscribe?ref=nagringa.dev`}>
              Participe da mentoria
              <Rocket className="ml-2 h-5 w-5 group-hover:motion-translate-x-in-[-134%] group-hover:motion-translate-y-in-[164%] group-hover:h-8 group-hover:w-8" />
            </Link>
          </Button>
          <Link
            href="https://newsletter.nagringa.dev/p/como-funciona-a-mentoria"
            className="text-sm border-white text-slate-300 font-medium text-center transition-colors hover:text-primary"
            target="_blank"
          >
            Como funciona a mentoria?
          </Link>
        </div>
        <Button variant="outline" size="xl" asChild className="min-w-80">
          <Link href={`${SOCIALS.newsletter}?ref=nagringa.dev`}>
            Veja minha newsletter
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </div>

      {/* Stats */}
      {/* <motion.div
        className="mt-16 flex justify-center items-center border-t border-white/10 pt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      > */}
      <div className="mt-16 flex justify-center items-center border-t border-white/10 pt-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl w-full">
          <AnimatedStat
            value={1300}
            label="inscritos na newsletter"
            color="text-primary"
          />
          <AnimatedStat
            value={150}
            label="membros na comunidade"
            color="text-yellow-400"
          />
          <AnimatedStat
            value={30}
            label="assinantes da mentoria"
            color="text-accent-secondary"
          />
        </div>
      </div>
      {/* </motion.div> */}
    </div>
  );
}
