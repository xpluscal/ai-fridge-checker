<script>
import {enhance} from '$app/forms';
import Stepper from './Stepper.svelte';
import SvelteSeo from "svelte-seo";
import { page } from '$app/stores';

  let step = 0;
  let calories = 2000;
  let macroPercentages = {
    protein: 30,
    carbs: 50,
    fat: 20,
  };
  let meals = {
    breakfast: false,
    lunch: true,
    dinner: false,
    snack: false,
  };
  let days = 5;
  let eatingPreferences;
  let allergies;
  let dislikes;
  let mealPlan = [];
  let orderableIngredients = [];
  let difficulty = "medium";

  let loading = false;
  let state = 1;
  let modalOpen = true;

  function nextStep() {
    step += 1;
  }

  function previousStep() {
    step -= 1;
  }

  function handleMealme() {
    const reducedUnits = orderableIngredients.reduce((acc, {name, amount}) => {
        return {
            ...acc,
            [name]: parseFloat(amount)
        }
    }, {});
    window.mealme.showCartSearchModal("conavio-sandbox", {query: reducedUnits});
  }
</script>

<style>
  .form-container {
    max-width: 960px;
    margin: 0 auto;
    padding: 1rem;
    margin-top: 2rem;
  }

  .header{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }

  .step {
    display: none;
  }

  .step.active {
    display: block;
  }

  .logo{
    height: 32px;
  }

  .scroll-modal{
    height: 340px;
    max-height: 80vh;
    overflow-y: scroll;
  }

  footer{
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  footer small{
    font-size: 0.8rem;
    max-width: 400px;
    margin-right: 1rem;
  }

  .bottom-footer{
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 2rem;
    width: 100%;
  }

  .error{
    background-color: #EA564A;
    color: #fff;
  }

  .warning{
    background-color: #F7B500;
    color: #fff;
    padding: 1rem;
    margin-top: 0;
    margin-bottom: 1rem;
  }

  .actions{
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
  }

  label{
    font-weight: 600;
  }

</style>

<svelte:head>
  <title>Meal Plan Creator</title>
</svelte:head>

<SvelteSeo
  title="What's in My Fridge?"
  description="Let's use AI to help us prevent food waste at home."
  keywords="artificial intelligence, "
  openGraph={{
    title: "What's in My Fridge?",
    description: "Let's use AI to help us prevent food waste at home.",
    images: [
      {
        url: $page.url.origin + '/seo-image.png',
        width: 1200,
        height: 630
      },
    ],
    url: 'https://www.ai-doctor.com/',
    type: 'website'
  }}
/>
<div class="form-container">
  <div class="header">
    <a href="/"><img src="/logo.svg" alt="Meal Plan Generator" class="logo"></a>
    <span>Personalized Meal Plan Generator</span>
  </div>

  {#if state === 1}
  <Stepper current={step}/>
  <form method="POST" action="?/submit" use:enhance={({ form, data, cancel }) => {
        loading = true;
        state = 2;
        return async ({ result }) => {
          console.log(result);
          if(result.status === 200) {
            mealPlan = result.data.days;
            orderableIngredients = result.data.orderable_ingredients;
            console.log(mealPlan);
            console.log(orderableIngredients);
            state = 4;
          } else {
            state = 3;
          }
        };
      }}>
    <div class="step {step === 0 ? 'active' : ''}">
      <p>
        Please enter the details for the meal plan you want:
      </p>
      <label for="calories">Calories per day:</label>
      <input type="number" id="calories" name="calories" bind:value="{calories}" placeholder="2000" min="0" />

      <label for="protein">Protein %:</label>
      <input type="number" id="protein" name="protein" bind:value="{macroPercentages.protein}" placeholder="30" min="0" max="100" />

      <label for="carbs">Carbs %:</label>
      <input type="number" id="carbs" name="carbs" bind:value="{macroPercentages.carbs}" placeholder="50" min="0" max="100" />

      <label for="fat">Fat %:</label>
      <input type="number" id="fat" name="fat" bind:value="{macroPercentages.fat}" placeholder="20" min="0" max="100" />

      <p>Select which meals to include in your plan:</p>
      <div class="flex">
        <label for="breakfast">Breakfast</label>
        <input type="checkbox" id="breakfast" name="breakfast" bind:checked="{meals.breakfast}" />
      </div>
      <div class="flex">
        <label for="lunch">Lunch</label>
        <input type="checkbox" id="lunch" name="lunch" bind:checked="{meals.lunch}" />
      </div>
      <label for="dinner">Dinner</label>
      <input type="checkbox" id="dinner" name="dinner" bind:checked="{meals.dinner}" />
      <label for="snack">Snack</label>
      <input type="checkbox" id="snack" name="snack" bind:checked="{meals.snack}" />

      <label for="days">Number of days to plan:</label>
      <input type="number" id="days" name="days" bind:value="{days}" placeholder="7" min="1" />

      <button disabled={!calories} type="button" on:click="{nextStep}" class="btn-primary">Next</button>
    </div>

    <div class="step {step === 1  ? 'active' : ''}">
      <p>Please provide some additional information about your eating preferences, allergies, and dislikes.</p>

      <label for="eatingPreferences">Eating Preferences</label>
      <select id="eatingPreferences" name="eatingPreferences" bind:value="{eatingPreferences}">
        <option value="">Select Preference</option>
        <option value="vegan">Vegan</option>
        <option value="vegetarian">Vegetarian</option>
        <option value="pescatarian">Pescatarian</option>
        <option value="meat">Meat</option>
        <option value="any">Any</option>
      </select>

      <label for="difficulty">Complexity</label>
      <select id="difficulty" name="difficulty" bind:value="{difficulty}">
        <option value="">Select Preference</option>
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
        <option value="michelin">Michelin Restaurant</option>
      </select>

      <label for="allergies">Allergies (Optional)</label>
      <input id="allergies" name="allergies" bind:value="{allergies}" placeholder="e.g., nuts, gluten, dairy..." />

      <label for="dislikes">Dislikes (Optional)</label>
      <input id="dislikes" name="dislikes" bind:value="{dislikes}" placeholder="e.g., mushrooms, spicy food, cilantro..." />

      <div class="actions">
        <button type="button" on:click="{previousStep}" class="secondary">Previous</button>
        <button type="submit" class="btn-primary">Submit</button>
      </div>
    </div>
  </form>
{:else if state === 2}
<article aria-busy="true">Finding Recipe Suggestions...</article>
{:else if state === 3}
<article class="error">Sorry, something went wrong. Please try again.</article>
{:else}
<h1>Mealplan Suggestions: </h1>
<article><small><b>Disclaimer:</b> The information provided on this website, including any recipe suggestions, is intended for informational and educational purposes only and should not be considered professional culinary advice. Always take into account your personal dietary restrictions and preferences before preparing or consuming any suggested recipes. If you have concerns about potential allergies or dietary restrictions, consult with a qualified healthcare professional or registered dietitian.</small></article>

<button type="button" on:click={handleMealme} class="btn-primary">Order Now</button>

{#each mealPlan as day, index}
<!-- <article> -->
<h2>
    Day {index}
</h2>

{#if day.lunch}

<h3>
    Lunch
</h3>

<ul>
        <article>
        <h4>{day.lunch.title}</h4>

        <h4>
            Ingredients
        </h4>

        <ul>
            {#each day.lunch.ingredients as ingredient}
                <li>
                    {ingredient.amount} {ingredient.unit} {ingredient.name}
                </li>
            {/each}
        </ul>

        <h4>
            Cooking Instructions
        </h4>

        <ol>
            {#each day.lunch.instructions as instruction}
                <li>
                    {instruction}
                </li>
            {/each}
        </ol>

        </article>
</ul>

{/if}
{:else}
   <!-- empty list -->
{/each}

{/if}

</div>

<div class="bottom-footer">
  <!-- <span>This tool does not provide medical advice. &nbsp;</span> -->
  <a href="#" on:click|preventDefault={() => modalOpen = true}>Terms of Use / Privacy Policy</a>
</div>

<dialog open={modalOpen}>
  <article>
    <div class="scroll-modal">
      <h1>Let's Waste Less Food!</h1>
      <p>Food waste is a significant global issue, and it starts right in our homes. By being mindful of the food we buy, cook, and consume, we can contribute to reducing food waste and its impact on our planet.</p>
      <p>Our app aims to help you waste less food by providing delicious recipes based on the ingredients you already have. However, please note that this app is experimental and for educational purposes only. Use it at your own risk, and we are not liable for the results. If you are unsure about the safety of any advice or information provided, always consult someone before proceeding.</p>
      <p>Together, we can make a difference in addressing food waste and contribute to a more sustainable future.</p>
    </div>
    <footer>
      <small>By clicking on "Accept" you agree to the terms of this Privacy Policy and Terms of Use.</small>
      <a on:click|preventDefault={() => modalOpen = false} href="#" role="button">Accept</a>
    </footer>
  </article>
</dialog>

<!-- <dialog open={modalOpen}>
  <article>
    <div class="scroll-modal">
      <article class="warning"><small>This app is experimental and for educational purposes only. Use at your own risk and always consult a health professional before taking any actions.</small></article>

      <h3>Terms of Use</h3>

      <small>
        <p>By using this website, you acknowledge and agree that the website owners and operators, including their employees, agents, or partners, shall not be held responsible or liable for any consequences, direct or indirect, arising from the information provided on this website, including any diagnosis, potential treatments, and next steps.</p>
        <p>You understand that the information provided is for informational and educational purposes only and should not be considered professional medical advice, diagnosis, or treatment.</p>
        <p>You agree to seek the advice of a qualified healthcare professional for any health or medical concerns before making any decisions based on the information provided on this website.</p>
        <p>The website owners and operators disclaim all liability for any damages or losses, direct or indirect, that may result from your use of or reliance on the information provided on this website.</p>
      </small>
      <br/>
      <h3>Privacy Policy</h3>
      <small>
        <p>This Privacy Policy explains how we collect, use, and protect your personal information when you use our website. By using our website, you agree to the terms of this Privacy Policy.</p>
        <ol>
          <li><b>Information Collection and Use:</b><br>We collect and use the information you provide when you use our website, such as your name, age, sex, weight, height, occupation, lifestyle, and medical history, for the sole purpose of providing you with a preliminary health evaluation using our AI Doctor service. This information is only temporarily stored on our server during the processing of your request.</li>
          <li><b>Data Sharing with Third Parties:</b><br>In order to provide our AI Doctor service, we use the OpenAI API to process your personal information. By using our website, you agree to the processing of your data by OpenAI in accordance with their privacy policy. We do not share your personal information with any other third parties, except when required by law or to protect the rights, property, or safety of our users or the public.</li>
          <li><b>Data Retention:</b><br>Your personal information is only stored on our server for a temporary period during the processing of your AI Doctor request. Once the processing is complete, your personal information is promptly deleted from our server.</li> 
          <li><b>Security:</b><br>We are committed to ensuring the security of your personal information. We use appropriate technical and organizational measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. However, please note that no method of electronic storage or transmission is 100% secure, and we cannot guarantee absolute security of your personal information.</li>
          <li><b>Children's Privacy:</b><br>Our website is not intended for use by individuals under the age of 13. We do not knowingly collect personal information from children under the age of 13. If we become aware that a child under the age of 13 has provided us with personal information, we will take steps to delete such information from our records.</li>
          <li><b>Changes to this Privacy Policy:</b><br>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.</li>
          <li><b>Contact Us:</b><br>If you have any questions about this Privacy Policy, please contact us at <a href="mailto:calvin.hoenes@proton.me">calvin.hoenes@proton.me</a>.</li>
        </ol>
        <p>By using our website and providing your personal information, you acknowledge and agree to the terms of this Privacy Policy.</p>
      </small>
    </div>
    <footer>
      <small>By clicking on "Accept" you agree to the terms of this Privacy Policy and Terms of Use.</small>
      <a on:click|preventDefault={() => modalOpen = false} href="#" role="button">Accept</a>
    </footer>
  </article>
</dialog> -->