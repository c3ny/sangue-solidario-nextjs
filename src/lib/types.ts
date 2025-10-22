// Tipos de dados baseados na análise do Back-End Java

export interface Bloodstock {
  id: string;
  // Ajustado para snake_case para corresponder ao JSON do Back-End
  blood_type: string; 
  quantity: number;
  // Ajustado para snake_case para corresponder ao JSON do Back-End
  update_date: string; 
}

export interface CompanyDTO {
  id: string;
  name: string;
  institutionName: string;
}

export interface BloodstockMovementRequestDTO {
  bloodstockId: string;
  quantity: number;
}

