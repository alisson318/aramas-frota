import { ArrowRight, Clock, Mail, Phone } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

const faqs = [
  {
    q: "Tem Wi-Fi e tomada para carregar o celular?",
    a: "Sim! Todos os nossos ônibus possuem internet via satélite Starlink de alta velocidade e tomadas USB individuais em todas as poltronas. Você pode assistir a vídeos, trabalhar ou navegar nas redes sociais durante toda a viagem sem se preocupar com a bateria.",
  },
  {
    q: "Qual a diferença entre as poltronas Leito Cama e Semi-Leito?",
    a: "As poltronas Leito Cama (no piso inferior) reclinam ao máximo, virando praticamente uma cama, ideais para dormir profundamente. As Semi-Leito (no piso superior) oferecem uma excelente inclinação e apoio para as pernas, perfeitas para descansar com muito conforto.",
  },
  {
    q: "Faz muito frio no ônibus? Preciso levar cobertor?",
    a: "Nossos veículos possuem ar-condicionado inteligente que mantém a temperatura do ambiente sempre agradável. Porém, como a sensibilidade ao frio varia de pessoa para pessoa, recomendamos sempre levar um agasalho leve ou manta na bagagem de mão, especialmente em viagens noturnas.",
  },
  {
    q: "Quanta bagagem posso levar na viagem?",
    a: "Você pode levar uma mochila ou bolsa de mão na cabine com seus itens essenciais. Suas malas maiores vão seguras e etiquetadas no bagageiro do ônibus, que possui capacidade gigante (ideal para excursões de compras e turismo de lazer). O limite exato de malas costuma ser definido pelo organizador da sua excursão.",
  },
  {
    q: "O ônibus tem banheiro e água a bordo?",
    a: "Com certeza. Nossos ônibus são equipados com banheiros modernos e rigorosamente higienizados antes e durante as viagens. Também contamos com frigobar, que geralmente é abastecido com água mineral para manter todos hidratados no trajeto.",
  },
  {
    q: "Com que frequência o ônibus faz paradas na estrada?",
    a: "A rota e as paradas são programadas pelo guia ou organizador do seu grupo. Em viagens longas, o padrão é fazer paradas a cada 3 ou 4 horas em postos de apoio grandes e seguros para alimentação, uso do banheiro externo e para esticar as pernas.",
  },
  {
    q: "Sou organizador de excursões, como faço para fretar este ônibus?",
    a: "Se você organiza grupos de turismo, viagens corporativas ou eventos, basta clicar em 'Solicitar Orçamento'. Nossa equipe montará uma proposta personalizada levando em conta o seu destino, a duração da viagem e o modelo de ônibus (DD ou LD) que melhor atende seus passageiros.",
  },
];

export default function FaqFrota() {
  return (
    <section className="bg-black text-white py-20 sm:py-28 md:snap-start">
      <div className="mx-auto max-w-6xl px-6 sm:px-10">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:items-start">
          <div className="lg:sticky lg:top-24 flex flex-col gap-5">
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-xs font-medium text-zinc-300 shadow-sm">
              Dúvidas Frequentes
            </span>
            <h2
              className="text-balance font-semibold tracking-tight text-white"
              style={{
                fontSize: "clamp(1.85rem, 4vw, 2.75rem)",
                letterSpacing: "-0.03em",
                lineHeight: 1.08,
              }}
            >
              Perguntas Frequentes
            </h2>
            <p className="text-sm text-zinc-400">
              Respostas rápidas sobre o nosso serviço de fretamento. Ainda tem dúvidas? Fale com a nossa equipe de atendimento.
            </p>

            <div className="mt-2 flex flex-col gap-2 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4">
              <div className="flex items-center gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white text-black">
                  <Phone className="size-4" />
                </span>
                <div className="flex flex-col leading-tight">
                  <p className="text-sm font-medium text-white">
                    Falar com um consultor
                  </p>
                  <p className="text-xs text-zinc-400">
                    <Clock className="mr-1.5 inline size-3" />
                    Atendimento rápido
                  </p>
                </div>
              </div>
              {/* The project defines no shadcn --ring token, so the focus ring color is set here */}
              <Button asChild className="mt-2 w-full rounded-full bg-white text-black hover:bg-zinc-200 focus-visible:ring-white/50" size="sm">
                <a
                  href="https://wa.me/554491366418?text=Ol%C3%A1%21%20Acabei%20de%20ver%20a%20frota%20de%20%C3%B4nibus%20no%20site%20e%20tenho%20interesse%20em%20conversar."
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Solicitar Orçamento
                  <ArrowRight className="ml-2 size-4" />
                </a>
              </Button>
              <p className="text-center text-[11px] text-zinc-400">
                <Mail className="mr-1 inline size-3" />
                Ou envie um e-mail para{" "}
                <a
                  href="mailto:contato@aramastur.com.br"
                  className="font-medium text-white underline-offset-4 hover:underline"
                >
                  contato@aramastur.com.br
                </a>
              </p>
            </div>
          </div>

          <Accordion className="w-full" collapsible type="single">
            {faqs.map((f, i) => (
              <AccordionItem className="border-zinc-800" key={f.q} value={`item-${i}`}>
                <AccordionTrigger className="text-left hover:text-zinc-300 focus-visible:ring-white/50">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-zinc-400">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
