export type MealCategory = 'breakfast' | 'lunch' | 'dinner' | 'snacks';

export interface MealLog {
  id: string;
  loggedAt: string;
  name: string;
  category: MealCategory;
  calories: number;
}
