import { Button } from "@/components/Button";

export const WelcomeSection = () => {
  return (
    <div className="row flex-lg-row-reverse align-items-center g-5 py-5 mt-5 mb-3">
      <div className="col-lg-6 col-12 col-sm-12">
        <h1 className="display-5 fw-bold mb-3">
          Seja solidário, <span className="text-danger">doe sangue!</span>
        </h1>
        <p className="lead text-justify">
          Somos a <span className="text-danger">sangue solidário</span> uma
          plataforma que a plataforma que conecta vidas por meio da
          solidariedade. Com apenas alguns cliques, você descobre onde sua
          doação é necessária ou cadastra a sua necessidade.
        </p>
        <p>
          Junte-se a nós nessa missão de amor e empatia e faça parte da corrente
          que transforma a solidariedade em esperança. Doe sangue, doe vida.
        </p>
        <div className="d-grid gap-2 d-md-flex justify-content-md-start">
          <a href="/solicitacoes">
            <Button>Ver solicitações</Button>
          </a>
          <a href="/criar-solicitacao">
            <Button variant="secondary">Cadastrar solicitação</Button>
          </a>
        </div>
      </div>
      <div className="col-12 col-sm-12 col-lg-6">
        <img
          src="https://www.sanguesolidario.com.br/assets/images/topo.jpg"
          className="d-block mx-lg-auto img-fluid"
        />
      </div>
    </div>
  );
};
