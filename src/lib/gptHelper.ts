interface UserData {
	name: string;
	calories: number;
	macroPercentages: {
		protein: number;
		carbs: number;
		fat: number;
	};
	meals: {
		breakfast: boolean;
		lunch: boolean;
		dinner: boolean;
		snack: boolean;
	};
	days: number;
	eatingPreferences: string;
	difficulty: string;
	allergies: string[];
	dislikes: string[];
}

export function createPrompt(userData: UserData): string {
	const {
		calories,
		macroPercentages,
		meals,
		days,
		eatingPreferences,
		allergies,
		dislikes,
		difficulty
	} = userData;
	const { protein, carbs, fat } = macroPercentages;
	const { breakfast, lunch, dinner, snack } = meals;
	const allergyList = allergies;
	const dislikeList = dislikes;

	const prompt = `Suggest a meal plan based on the following user data:\n\nCalories per day: ${calories}\nMacronutrient percentages: Protein - ${protein}%, Carbs - ${carbs}%, Fat - ${fat}%\nMeals to include: Breakfast - ${breakfast}, Lunch - ${lunch}, Dinner - ${dinner}, Snack - ${snack}\nDays: ${days}\nEating preferences: ${eatingPreferences}\nDifficulty: ${difficulty}\nAllergies: ${allergyList}\nDislikes: ${dislikeList}\n\nProvide a meal plan in JSON format with an array field "days" for ${days} days, each day containing an object with "breakfast", "lunch", "dinner", and "snack" (if requested) as keys, and recipes as values. Each recipe should have "title", "description", "ingredients" (an array of objects with "amount" as float, "unit", and "name"), "instructions" (as string array), and approximate "preparation_time" in minutes. Please also create an array "orderable_ingredients" that adds the ingredients together and then replaces the quantity with the next biggest common item quantity that you would find at an american supermarket like Walmart.  Ensure VALID JSON and minimize characters used. Incorrect JSON will not be accepted. No trailing commas in JSON arrays. Talk directly to the user. The response cannot be longer than 1023 tokens.`;

	return prompt;
}
