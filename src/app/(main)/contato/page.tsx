"use client";
import contactService from "@/features/Contact/services/contact.service";

export default function Home() {
  return (
    <>
      <div className="container mb-5 gy-5">
        <div className="row flex-lg-row-reverse align-items-center g-5 py-5 mt-5 mb-3">
          <div className="col-lg-12 col-12 col-sm-12">
            <h2 className="display-7 fw-bold mb-3">Fale Conosco</h2>
            <p className="lead mb-4">
              Entre em contato conosco para tirar dúvidas, fazer sugestões ou
              relatar problemas.
            </p>
            <form>
              <div className="row g-3">
                <div className="col-md-6">
                  <label htmlFor="nome" className="form-label">
                    Nome
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="nome"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    required
                  />
                </div>
                <div className="col-12">
                  <label htmlFor="assunto" className="form-label">
                    Assunto
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="assunto"
                    required
                  />
                </div>
                <div className="col-12">
                  <label htmlFor="mensagem" className="form-label">
                    Mensagem
                  </label>
                  <textarea
                    className="form-control"
                    id="mensagem"
                    rows={7}
                    required
                  ></textarea>
                </div>
                <div className="col-12">
                  <button
                    type="submit"
                    className="btn btn-danger"
                    onClick={() => {
                      contactService.registerContact({
                        name: "Test",
                        email: "Teste",
                        message: "teste",
                        subject: "teste",
                      });
                    }}
                  >
                    Enviar
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
