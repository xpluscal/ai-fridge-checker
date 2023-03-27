interface UserData {
  ingredients: string[];
  name: string;
  eatingPreferences: string;
  maxCookTime: number;
  difficulty: string;
  allergies: string[];
  dislikes: string[];
}

export function createPrompt(userData: UserData): string {
  const { ingredients, eatingPreferences, allergies, dislikes, maxCookTime, difficulty } = userData;
  const ingredientList = ingredients;
  const allergyList = allergies;
  const dislikeList = dislikes;

  const prompt = `Suggest 1-4 recipe ideas based on the following user data:\n\nIngredients in fridge (only use those ingredients and basics like condiments or spices): ${ingredientList}\nEating preferences: ${eatingPreferences}\nAllergies: ${allergyList}\nDislikes: ${dislikeList}.\nDifficulty: ${difficulty}.\nMaximum Cook Time: ${maxCookTime}.\n\nProvide 1-4 recipe suggestions in JSON format as an array field "recipes", ordered by relevance and ease of preparation, each with title, description, ingredients (an array of objects with "amount" as float, "unit" and "name") needed (in addition to those provided), cooking instructions (as string array), and approximate preparation time in minutes. Ensure VALID JSON and minimize characters used. Incorrect JSON will not be accepted. No trailing commas in JSON arrays. Talk directly to the user. The response cannot be longer than 1023 tokens.`;

  return prompt;
}