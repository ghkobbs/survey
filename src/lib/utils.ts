import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const QUESTION_TYPES = {
	RATING: 'rating',
	RATING_10: 'rating_10',
	MULTIPLE_CHOICE: 'multiple_choice',
	TEXT: 'text',
	BOOLEAN: 'boolean'
};

export const RATINGS = [1, 2, 3, 4, 5];

export const RATINGS_10 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
