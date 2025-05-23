import Image from "next/image";

export async function BlogSection() {
  const data = await (await fetch("http://localhost:3333/blog")).json();

  const blogContent = data;
  console.log(blogContent);
  return (
    <>
      <div className="row">
        <h2 className="display-7 fw-bold mb-3">Se mantenha informado</h2>
      </div>
      <div
        id="blogCarousel"
        className="carousel slide mb-5 position-relative"
        data-bs-ride="carousel"
      >
        <div className="carousel-inner">
          <div className="carousel-item active">
            <div className="row">
              <div className="col-12 col-md-4 mb-3">
                <div className="card shadow-sm">
                  <a
                    href="blog.html"
                    className="text-dark text-decoration-none"
                  >
                    <img
                      src="assets/images/blog/01.jpg"
                      alt=""
                      className="card-img-top"
                    />
                    <div className="card-body">
                      <h6 className="fw-bold mb-1">A importância da doação</h6>
                      <p className="card-text previa-blog">
                        A doação de sangue é um ato essencial de solidariedade
                        que pode salvar inúmeras vidas, especialmente em
                        situações de emergência, cirurgias e tratamentos para
                        doenças graves. Com uma única doação, é possível ajudar
                        até quatro pessoas.
                      </p>
                    </div>
                  </a>
                </div>
              </div>
              <div className="col-6 col-md-4 mb-3">
                <div className="card shadow-sm">
                  <img
                    src="assets/images/blog/02.jpg"
                    alt=""
                    className="card-img-top"
                  />
                  <div className="card-body">
                    <h6 className="fw-bold mb-1">Quem pode doar?</h6>
                    <p className="card-text previa-blog">
                      Para doar sangue, é necessário atender a alguns critérios
                      que garantem a segurança do doador e do receptor. Podem
                      doar pessoas com boas condições de saúde, entre 16 e 69
                      anos.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-6 col-md-4 mb-3">
                <div className="card shadow-sm">
                  <img
                    src="assets/images/blog/03.jpg"
                    alt=""
                    className="card-img-top"
                  />
                  <div className="card-body">
                    <h6 className="fw-bold mb-1">A doação no Brasil</h6>
                    <p className="card-text previa-blog">
                      No Brasil, as doações de sangue representam uma importante
                      ação de saúde pública e solidariedade, atendendo milhares
                      de pessoas que dependem desse recurso em casos de
                      emergência.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="carousel-item">
            <div className="row">
              <div className="col-12 col-md-4 mb-3">
                <div className="card shadow-sm">
                  <a
                    href="blog.html"
                    className="text-dark text-decoration-none"
                  >
                    <img
                      src="assets/images/blog/04.jpg"
                      alt=""
                      className="card-img-top"
                    />
                    <div className="card-body">
                      <h6 className="fw-bold mb-1">Impacto das Doações</h6>
                      <p className="card-text previa-blog">
                        A cada dia, o sangue doado é essencial para diversas
                        situações médicas, como cirurgias de emergência e
                        tratamentos para doenças crônicas. Doe sangue e faça a
                        diferença!
                      </p>
                    </div>
                  </a>
                </div>
              </div>
              <div className="col-6 col-md-4 mb-3">
                <div className="card shadow-sm">
                  <img
                    src="assets/images/blog/05.jpg"
                    alt=""
                    className="card-img-top"
                  />
                  <div className="card-body">
                    <h6 className="fw-bold mb-1">Doação Regular</h6>
                    <p className="card-text previa-blog">
                      A doação regular é fundamental para manter os estoques dos
                      hemocentros. Este ato simples e seguro pode ser realizado
                      a cada dois ou três meses.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-6 col-md-4 mb-3">
                <div className="card shadow-sm">
                  <Image
                    src="/assets/images/blog/06.jpg"
                    alt=""
                    className="card-img-top"
                    width={203}
                    height={100}
                  />
                  <div className="card-body">
                    <h6 className="fw-bold mb-1">Tipos Raros</h6>
                    <p className="card-text previa-blog">
                      Pessoas com tipos sanguíneos raros são essenciais para
                      manter os estoques de sangue diversificados. Cada doação é
                      uma esperança a mais para quem precisa.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
