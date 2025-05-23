import Image from "next/image";

export const MapSection = () => {
  return (
    <div className="row g-5 row align-items-center mb-5 d-none d-lg-flex py-5 mb-5">
      <div className="col-12">
        <h2 className="display-7 fw-bold mb-3">
          12 hemocentros e 67 pessoas precisam da sua ajuda!
        </h2>
        <Image
          src="/assets/images/map-placeholder.jpg"
          height={400}
          width={1200}
          alt=""
        />
      </div>
    </div>
  );
};
