"use client";

import styles from "./styles.module.scss";
import { Accordion, AccordionItem } from "@/components/Accordion";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

export const FAQSection = () => {
  const faqs: FAQItem[] = [
    {
      id: 1,
      question: "Quem pode doar sangue?",
      answer:
        "Podem doar sangue pessoas entre 16 e 69 anos (menores de 18 anos precisam de autorização dos responsáveis), pesando no mínimo 50kg, que estejam em bom estado de saúde e não apresentem condições que impeçam a doação.",
    },
    {
      id: 2,
      question: "Com que frequência posso doar?",
      answer:
        "Homens podem doar sangue a cada 60 dias, com limite de 4 doações por ano. Mulheres podem doar a cada 90 dias, com limite de 3 doações por ano. É importante respeitar esse intervalo para a recuperação adequada do organismo.",
    },
    {
      id: 3,
      question: "Como funciona a plataforma Sangue Solidário?",
      answer:
        "A plataforma conecta doadores a pessoas que precisam de sangue. Hospitais e usuários criam solicitações com informações sobre o tipo sanguíneo necessário e a localização. Doadores compatíveis próximos recebem notificações e podem oferecer ajuda.",
    },
    {
      id: 4,
      question: "Preciso estar em jejum para doar sangue?",
      answer:
        "Não é necessário estar em jejum. Na verdade, é recomendado fazer uma refeição leve antes da doação, evitando alimentos gordurosos. Também é importante estar bem hidratado e ter dormido bem na noite anterior.",
    },
    {
      id: 5,
      question: "Quanto tempo dura o processo de doação?",
      answer:
        "O processo completo de doação, incluindo cadastro, triagem, coleta e lanche, dura aproximadamente 40 a 60 minutos. A coleta do sangue em si leva apenas cerca de 10 a 15 minutos.",
    },
    {
      id: 6,
      question: "A doação de sangue é segura?",
      answer:
        "Sim, a doação de sangue é totalmente segura. Todo o material utilizado é descartável e esterilizado. O procedimento é realizado por profissionais treinados, seguindo rigorosos protocolos de segurança e higiene.",
    },
    {
      id: 7,
      question: "Como sei se minha doação foi utilizada?",
      answer:
        "Através da plataforma Sangue Solidário, você pode acompanhar o histórico de suas doações no seu perfil. Quando sua doação ajuda alguém, você recebe uma notificação e pode ver o impacto positivo que causou.",
    },
    {
      id: 8,
      question: "Posso escolher para quem doar?",
      answer:
        "Sim! Na plataforma você pode visualizar solicitações específicas de pessoas que precisam de sangue e escolher para qual delas deseja doar. Você também pode doar para o estoque geral de hemocentros, que será utilizado conforme a necessidade.",
    },
  ];

  // Transform FAQs to Accordion items format
  const accordionItems: AccordionItem[] = faqs.map((faq) => ({
    id: faq.id,
    title: faq.question,
    content: faq.answer,
  }));

  return (
    <div className={styles.faqSection} id="faq">
      <div className={styles.header}>
        <h2 className={styles.headerTitle}>Perguntas Frequentes</h2>
        <p className={styles.headerSubtitle}>
          Tire suas dúvidas sobre doação de sangue e nossa plataforma
        </p>
      </div>

      <Accordion items={accordionItems} className={styles.faqContainer} />

      <div className={styles.callToAction}>
        <p className={styles.callToActionText}>
          Ainda tem dúvidas? Entre em contato conosco!
        </p>
        <a href="/contato" className={styles.contactButton}>
          Fale Conosco
        </a>
      </div>
    </div>
  );
};
