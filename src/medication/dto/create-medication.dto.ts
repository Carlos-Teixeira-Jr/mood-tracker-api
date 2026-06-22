export class CreateMedicationDto {
  userId!: string;
  name!: string;
  dosage?: string;
  active?: boolean;
}
