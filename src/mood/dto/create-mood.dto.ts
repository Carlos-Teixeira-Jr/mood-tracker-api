export class CreateMoodDto {
  date!: string;
  score!: number;
  anxiety?: number;
  energy?: number;
  irritability?: number;
  notes?: string;
}
