<script>
    export let steps = [{
        title: "What's in your fridge?",
        content: 'Step 1 content'
    }, {
        title: 'Your Preferences',
        content: 'Step 2 content'
    }];

    export let current = 0;
</script>

<style>
    .steps {
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        counter-reset: section;
        margin-bottom: 1rem;
    }

    .steps div {
        flex: 1;
        text-align: center;
        padding: 1rem;
    }

    .steps div::before {
        counter-increment: section;
        content: counter(section);
        display: inline-block;
        width: 1.5rem;
        height: 1.5rem;
        border-radius: 50%;
        background: #ccc;
        /* padding: 0.5rem; */
        margin-right: 1rem;
        margin-top: 1rem;
    }

    .steps div.active::before{
        background-color: var(--primary);
        color: #fefefe;
    }

    @media (prefers-color-scheme: dark) {
        .steps div::before {
            background: #333;
        }

        .steps div.active::before{
            background: #fefefe;
            color: #333;
        }
    }

    .active{
        font-weight: bold;
    }

    @media (max-width: 600px) {
        .steps div small {
            display: none;
        }

        .steps div::before {
            width: 1.5rem;
            height: 1.5rem;
            border-radius: 50%;
            background: #ccc;
            /* padding: 0.5rem; */
            margin-right: 0rem;
            margin-top: 1rem;
        }
    }
</style>

<div class="steps">
    {#each steps as step, index}
        <div class="{index === current ? "active" : ""}">
            <span>{step.title}</span>
        </div>
    {/each}
</div>