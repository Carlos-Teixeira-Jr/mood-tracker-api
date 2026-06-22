export class UpdateMedicationDto {
  userId!: string;
  name!: string;
  dosage?: string;
  active?: boolean;
}
