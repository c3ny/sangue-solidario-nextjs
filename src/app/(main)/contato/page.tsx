"use client";

import { useState } from "react";
import {
  BsEnvelope,
  BsPhone,
  BsGeoAlt,
  BsClock,
  BsPerson,
  BsChatDots,
  BsCheckCircleFill,
  BsArrowRight,
  BsHeart,
} from "react-icons/bs";
import { Input } from "@/components/Input";
import { Textarea } from "@/components/Textarea";
import contactService from "@/features/Contact/services/contact.service";
import styles from "./styles.module.scss";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await contactService.registerContact(formData);
      setIsSubmitted(true);
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Erro ao enviar mensagem. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: BsEnvelope,
      title: "E-mail",
      info: "contato@sanguesolidario.com.br",
      link: "mailto:contato@sanguesolidario.com.br",
      color: "red",
    },
    {
      icon: BsPhone,
      title: "Telefone",
      info: "(11) 1234-5678",
      link: "tel:+551112345678",
      color: "blue",
    },
    {
      icon: BsGeoAlt,
      title: "Endereço",
      info: "São Paulo, SP - Brasil",
      link: "#",
      color: "green",
    },
    {
      icon: BsClock,
      title: "Horário",
      info: "Seg-Sex: 8h às 18h",
      link: "#",
      color: "orange",
    },
  ];

  return (
    <main className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.badge}>
            <BsHeart className={styles.badgeIcon} />
            <span>Estamos aqui para ajudar</span>
          </div>
          <h1 className={styles.heroTitle}>
            Entre em <span className={styles.highlight}>contato</span> conosco
          </h1>
          <p className={styles.heroText}>
            Tem alguma dúvida, sugestão ou precisa de ajuda? Nossa equipe está
            pronta para atendê-lo. Preencha o formulário abaixo e responderemos
            o mais breve possível.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className={styles.infoSection}>
        <div className={styles.infoGrid}>
          {contactInfo.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.title}
                href={item.link}
                className={`${styles.infoCard} ${
                  styles[
                    `infoCard${
                      item.color.charAt(0).toUpperCase() + item.color.slice(1)
                    }`
                  ]
                }`}
              >
                <div className={styles.infoIcon}>
                  <Icon />
                </div>
                <h3 className={styles.infoTitle}>{item.title}</h3>
                <p className={styles.infoText}>{item.info}</p>
              </a>
            );
          })}
        </div>
      </section>

      {/* Contact Form Section */}
      <section className={styles.formSection}>
        <div className={styles.formContainer}>
          {!isSubmitted ? (
            <>
              <div className={styles.formHeader}>
                <h2 className={styles.formTitle}>Envie sua mensagem</h2>
                <p className={styles.formSubtitle}>
                  Preencha o formulário abaixo e entraremos em contato em breve
                </p>
              </div>

              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGrid}>
                  <Input
                    label="Nome completo"
                    icon={BsPerson}
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Seu nome completo"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    showRequired
                  />

                  <Input
                    label="E-mail"
                    icon={BsEnvelope}
                    type="email"
                    id="email"
                    name="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    showRequired
                  />
                </div>

                <Input
                  label="Assunto"
                  icon={BsChatDots}
                  type="text"
                  id="subject"
                  name="subject"
                  placeholder="Sobre o que você quer falar?"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  showRequired
                />

                <Textarea
                  label="Mensagem"
                  id="message"
                  name="message"
                  placeholder="Digite sua mensagem aqui..."
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  showRequired
                />

                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span>Enviando...</span>
                  ) : (
                    <>
                      <span>Enviar mensagem</span>
                      <BsArrowRight className={styles.buttonIcon} />
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className={styles.successContent}>
              <div className={styles.successIcon}>
                <BsCheckCircleFill />
              </div>
              <h2 className={styles.successTitle}>Mensagem enviada!</h2>
              <p className={styles.successText}>
                Obrigado por entrar em contato! Recebemos sua mensagem e nossa
                equipe responderá em breve.
              </p>
              <button
                type="button"
                onClick={() => setIsSubmitted(false)}
                className={styles.newMessageButton}
              >
                Enviar nova mensagem
              </button>
            </div>
          )}
        </div>

        {/* Side Panel */}
        <div className={styles.sidePanel}>
          <div className={styles.sidePanelContent}>
            <h3 className={styles.sidePanelTitle}>Por que nos contatar?</h3>
            <ul className={styles.sidePanelList}>
              <li className={styles.sidePanelItem}>
                <BsCheckCircleFill className={styles.sidePanelIcon} />
                <span>Dúvidas sobre doação de sangue</span>
              </li>
              <li className={styles.sidePanelItem}>
                <BsCheckCircleFill className={styles.sidePanelIcon} />
                <span>Suporte técnico da plataforma</span>
              </li>
              <li className={styles.sidePanelItem}>
                <BsCheckCircleFill className={styles.sidePanelIcon} />
                <span>Parcerias e colaborações</span>
              </li>
              <li className={styles.sidePanelItem}>
                <BsCheckCircleFill className={styles.sidePanelIcon} />
                <span>Sugestões de melhorias</span>
              </li>
              <li className={styles.sidePanelItem}>
                <BsCheckCircleFill className={styles.sidePanelIcon} />
                <span>Denúncias ou problemas</span>
              </li>
            </ul>

            <div className={styles.sidePanelFooter}>
              <p className={styles.sidePanelFooterText}>
                Responderemos sua mensagem em até
                <strong>24 horas úteis</strong>
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
