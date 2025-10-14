import { ImagePlaceholder } from "@/components/ImagePlaceholder";

export interface ISolicitationCardProps {
  name: string;
  bloodType: string;
  image?: string;
  id: number;
}

export const SolicitationCard = ({
  name,
  bloodType,
  image,
  id,
}: ISolicitationCardProps) => {
  return (
    <div className="card border-0 shadow-sm rounded-3 p-3 d-flex flex-row align-items-center mb-3 bg-light">
      {image ? (
        <img
          className="rounded-circle me-3"
          src={image}
          alt="Foto do Paciente"
          width={80}
          height={80}
          style={{ objectFit: "cover", width: 80, height: 80 }}
        />
      ) : (
        <ImagePlaceholder className="rounded-circle me-3" />
      )}
      <div className="flex-grow-1">
        <h5 className="mb-1 fw-bold">{name}</h5>
        <p className="mb-0 text-danger">
          <i className="bi bi-droplet"></i> {bloodType}
        </p>
      </div>
      <a href={`/visualizar-solicitacao/${id}`}>
        <button className="btn btn-danger px-4">Quero doar</button>
      </a>
    </div>
  );
};
