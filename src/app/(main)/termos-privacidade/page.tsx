import { Metadata } from "next";
import styles from "./styles.module.scss";

export const metadata: Metadata = {
  title: "Termos de Uso e Política de Privacidade - Sangue Solidário",
  description:
    "Conheça nossos termos de uso e política de privacidade para uso da plataforma Sangue Solidário",
};

export default function TermosPrivacidadePage() {
  return (
    <main className={styles.container}>
      <div className={styles.content}>
        <header className={styles.header}>
          <h1 className={styles.title}>
            Termos de Uso e Política de Privacidade
          </h1>
          <p className={styles.subtitle}>
            Última atualização: {new Date().toLocaleDateString("pt-BR")}
          </p>
        </header>

        <div className={styles.sections}>
          {/* Termos de Uso */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>1. Termos de Uso</h2>

            <div className={styles.subsection}>
              <h3 className={styles.subsectionTitle}>
                1.1. Aceitação dos Termos
              </h3>
              <p className={styles.text}>
                Ao acessar e utilizar a plataforma Sangue Solidário, você
                concorda em cumprir e estar vinculado aos seguintes termos e
                condições de uso. Se você não concordar com qualquer parte
                destes termos, não deve utilizar nossa plataforma.
              </p>
            </div>

            <div className={styles.subsection}>
              <h3 className={styles.subsectionTitle}>
                1.2. Descrição do Serviço
              </h3>
              <p className={styles.text}>
                O Sangue Solidário é uma plataforma digital que conecta doadores
                de sangue com pessoas e instituições que necessitam de doações.
                Nossa missão é facilitar o processo de doação de sangue,
                promovendo a solidariedade e salvando vidas.
              </p>
            </div>

            <div className={styles.subsection}>
              <h3 className={styles.subsectionTitle}>1.3. Elegibilidade</h3>
              <p className={styles.text}>
                Para utilizar nossa plataforma, você deve:
              </p>
              <ul className={styles.list}>
                <li>Ter pelo menos 18 anos de idade</li>
                <li>Fornecer informações verdadeiras e precisas</li>
                <li>
                  Estar em conformidade com as leis locais e regulamentações de
                  doação de sangue
                </li>
                <li>
                  Não ter sido previamente suspenso ou banido da plataforma
                </li>
              </ul>
            </div>

            <div className={styles.subsection}>
              <h3 className={styles.subsectionTitle}>
                1.4. Responsabilidades do Usuário
              </h3>
              <p className={styles.text}>
                Como usuário da plataforma, você se compromete a:
              </p>
              <ul className={styles.list}>
                <li>Fornecer informações precisas e atualizadas</li>
                <li>Respeitar outros usuários e manter um ambiente cordial</li>
                <li>
                  Não utilizar a plataforma para atividades ilegais ou
                  inadequadas
                </li>
                <li>Manter a confidencialidade de sua conta e senha</li>
                <li>
                  Notificar imediatamente qualquer uso não autorizado de sua
                  conta
                </li>
              </ul>
            </div>

            <div className={styles.subsection}>
              <h3 className={styles.subsectionTitle}>1.5. Proibições</h3>
              <p className={styles.text}>É expressamente proibido:</p>
              <ul className={styles.list}>
                <li>Fornecer informações falsas ou enganosas</li>
                <li>
                  Utilizar a plataforma para fins comerciais não autorizados
                </li>
                <li>Interferir no funcionamento da plataforma</li>
                <li>Violar direitos de propriedade intelectual</li>
                <li>Assediar, ameaçar ou intimidar outros usuários</li>
                <li>
                  Compartilhar conteúdo ofensivo, difamatório ou inadequado
                </li>
              </ul>
            </div>

            <div className={styles.subsection}>
              <h3 className={styles.subsectionTitle}>
                1.6. Limitação de Responsabilidade
              </h3>
              <p className={styles.text}>
                A plataforma Sangue Solidário atua como intermediária entre
                doadores e receptores. Não nos responsabilizamos por:
              </p>
              <ul className={styles.list}>
                <li>Compatibilidade sanguínea entre doadores e receptores</li>
                <li>Procedimentos médicos realizados em hemocentros</li>
                <li>Danos decorrentes do uso inadequado da plataforma</li>
                <li>Interrupções temporárias do serviço</li>
              </ul>
            </div>
          </section>

          {/* Política de Privacidade */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>2. Política de Privacidade</h2>

            <div className={styles.subsection}>
              <h3 className={styles.subsectionTitle}>
                2.1. Informações Coletadas
              </h3>
              <p className={styles.text}>
                Coletamos as seguintes categorias de informações:
              </p>
              <ul className={styles.list}>
                <li>
                  <strong>Informações de Cadastro:</strong> Nome, e-mail,
                  telefone, endereço
                </li>
                <li>
                  <strong>Informações Médicas:</strong> Tipo sanguíneo, data de
                  nascimento, CPF (para doadores)
                </li>
                <li>
                  <strong>Informações Institucionais:</strong> CNPJ, nome da
                  instituição, CNES (para empresas)
                </li>
                <li>
                  <strong>Dados de Uso:</strong> Histórico de atividades na
                  plataforma
                </li>
                <li>
                  <strong>Informações Técnicas:</strong> Endereço IP, tipo de
                  navegador, sistema operacional
                </li>
              </ul>
            </div>

            <div className={styles.subsection}>
              <h3 className={styles.subsectionTitle}>
                2.2. Como Utilizamos suas Informações
              </h3>
              <p className={styles.text}>Utilizamos suas informações para:</p>
              <ul className={styles.list}>
                <li>Fornecer e melhorar nossos serviços</li>
                <li>Facilitar a conexão entre doadores e receptores</li>
                <li>Comunicar atualizações importantes sobre a plataforma</li>
                <li>Garantir a segurança e integridade da plataforma</li>
                <li>Cumprir obrigações legais e regulamentares</li>
                <li>Gerar estatísticas anônimas para melhorias</li>
              </ul>
            </div>

            <div className={styles.subsection}>
              <h3 className={styles.subsectionTitle}>
                2.3. Compartilhamento de Informações
              </h3>
              <p className={styles.text}>
                Não vendemos, alugamos ou compartilhamos suas informações
                pessoais com terceiros, exceto:
              </p>
              <ul className={styles.list}>
                <li>Com seu consentimento explícito</li>
                <li>Para cumprir obrigações legais</li>
                <li>
                  Com prestadores de serviços que nos auxiliam na operação da
                  plataforma
                </li>
                <li>
                  Em caso de fusão, aquisição ou reestruturação da empresa
                </li>
                <li>Para proteger nossos direitos, propriedade ou segurança</li>
              </ul>
            </div>

            <div className={styles.subsection}>
              <h3 className={styles.subsectionTitle}>
                2.4. Segurança dos Dados
              </h3>
              <p className={styles.text}>
                Implementamos medidas de segurança técnicas e organizacionais
                para proteger suas informações:
              </p>
              <ul className={styles.list}>
                <li>Criptografia de dados sensíveis</li>
                <li>Controle de acesso restrito</li>
                <li>Monitoramento de segurança contínuo</li>
                <li>Treinamento regular da equipe</li>
                <li>Auditorias de segurança periódicas</li>
              </ul>
            </div>

            <div className={styles.subsection}>
              <h3 className={styles.subsectionTitle}>2.5. Seus Direitos</h3>
              <p className={styles.text}>Você tem o direito de:</p>
              <ul className={styles.list}>
                <li>Acessar suas informações pessoais</li>
                <li>Corrigir dados incorretos ou incompletos</li>
                <li>Solicitar a exclusão de suas informações</li>
                <li>Retirar seu consentimento a qualquer momento</li>
                <li>Solicitar a portabilidade dos seus dados</li>
                <li>Opor-se ao processamento de suas informações</li>
              </ul>
            </div>

            <div className={styles.subsection}>
              <h3 className={styles.subsectionTitle}>2.6. Retenção de Dados</h3>
              <p className={styles.text}>
                Mantemos suas informações pessoais apenas pelo tempo necessário
                para cumprir as finalidades descritas nesta política, a menos
                que um período de retenção mais longo seja exigido ou permitido
                por lei.
              </p>
            </div>

            <div className={styles.subsection}>
              <h3 className={styles.subsectionTitle}>
                2.7. Cookies e Tecnologias Similares
              </h3>
              <p className={styles.text}>
                Utilizamos cookies e tecnologias similares para melhorar sua
                experiência na plataforma, analisar o uso e personalizar
                conteúdo. Você pode controlar o uso de cookies através das
                configurações do seu navegador.
              </p>
            </div>
          </section>

          {/* Disposições Gerais */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>3. Disposições Gerais</h2>

            <div className={styles.subsection}>
              <h3 className={styles.subsectionTitle}>3.1. Modificações</h3>
              <p className={styles.text}>
                Reservamo-nos o direito de modificar estes termos e política de
                privacidade a qualquer momento. As alterações entrarão em vigor
                imediatamente após a publicação na plataforma. É sua
                responsabilidade revisar periodicamente estes documentos.
              </p>
            </div>

            <div className={styles.subsection}>
              <h3 className={styles.subsectionTitle}>3.2. Lei Aplicável</h3>
              <p className={styles.text}>
                Estes termos são regidos pelas leis brasileiras. Qualquer
                disputa será resolvida nos tribunais competentes do Brasil.
              </p>
            </div>

            <div className={styles.subsection}>
              <h3 className={styles.subsectionTitle}>3.3. Vigência</h3>
              <p className={styles.text}>
                Estes termos e política de privacidade entram em vigor a partir
                da data de sua publicação e permanecem válidos até que sejam
                modificados ou revogados.
              </p>
            </div>
          </section>

          {/* Aviso Importante */}
          <section className={styles.importantNotice}>
            <h2 className={styles.noticeTitle}>⚠️ Aviso Importante</h2>
            <p className={styles.noticeText}>
              A plataforma Sangue Solidário é uma ferramenta de conexão e não
              substitui a avaliação médica adequada. Sempre consulte
              profissionais de saúde qualificados antes de realizar qualquer
              doação de sangue. A compatibilidade sanguínea deve ser verificada
              por profissionais especializados.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
