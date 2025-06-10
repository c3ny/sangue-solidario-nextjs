export default function Home() {
  return (
    <>
      <div className="container mb-5">
        <div className="row align-items-center g-5 py-5 mt-5 mb-3">
          <div className="col-12">
            <h1 className="display-5 fw-bold mb-3">
              Crie uma solicitação de doação de sangue
            </h1>
            <p className="lead">
              Preencha as informações necessárias para que doadores possam
              encontrar sua solicitação e ajudar quem precisa.
            </p>
          </div>
          <div className="col-12">
            <form>
              <div className="row g-3">
                <div className="col-md-6">
                  <label htmlFor="nome" className="form-label">
                    Nome do paciente
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="nome"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="telefone" className="form-label">
                    Telefone para contato
                  </label>
                  <input type="text" className="form-control" id="telefone" />
                </div>
                <div className="col-md-6">
                  <label htmlFor="tipoSanguineo" className="form-label">
                    Tipo sanguíneo
                  </label>
                  <select className="form-select" id="tipoSanguineo" required>
                    <option value="" disabled>
                      Selecione o tipo sanguíneo
                    </option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label htmlFor="quantidade" className="form-label">
                    Quantidade de bolsas
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="quantidade"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="datainicio" className="form-label">
                    Data de início da solicitação
                  </label>
                  <input type="date" className="form-control" id="datainicio" />
                </div>
                <div className="col-md-6">
                  <label htmlFor="datatermino" className="form-label">
                    Data de término da solicitação
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="datatermino"
                  />
                </div>
                <div className="col-12">
                  <label htmlFor="endereco" className="form-label">
                    Endereço para doação
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="endereco"
                    required
                  />
                </div>
                <div className="col-12">
                  <label htmlFor="descricao" className="form-label">
                    Descrição
                  </label>
                  <textarea
                    className="form-control"
                    id="descricao"
                    rows={5}
                    placeholder="Se desejar, adicione uma descrição da solicitação"
                  ></textarea>
                </div>
                <div className="mb-3">
                  <label htmlFor="formFile" className="form-label">
                    Foto do paciente
                  </label>
                  <input className="form-control" type="file" id="formFile" />
                </div>
                <div className="col-12">
                  <button type="submit" className="btn btn-lg btn-danger">
                    Criar solicitação
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
