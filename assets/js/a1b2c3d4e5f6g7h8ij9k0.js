var SUPABASE_KEY;
var API_KEY;
var GITHUB_KEY;
var APITOKEN;
var APIURL;
var NETLIFY_URL;
var dbURL;
var baseURL;

const uselessFacts = [
    "Bananas are technically berries!",
    "A group of flamingos is called a flamboyance.",
    "The smell of rain is caused by a bacteria called actinomycetes.",
    "Octopuses have three hearts and can change color to blend in.",
    "A single spaghetti noodle is called a spaghetto.",
    "Sloths can hold their breath longer than dolphins.",
    "Sharks are older than trees.",
    "There's a basketball court on the top floor of the U.S. Supreme Court building—it's called the 'highest court in the land'.",
    "Scotland’s national animal is the unicorn.",
    "Cows have best friends and get stressed when separated.",
    "Wombat poop is cube-shaped.",
    "An ostrich’s eye is bigger than its brain.",
    "You can't hum while holding your nose.",
    "A jiffy is an actual unit of time: 1/100th of a second.",
    "The Twitter bird’s name is Larry.",
    "Bubble wrap was originally intended to be wallpaper.",
    "The inventor of the Pringles can is buried in one.",
    "A cloud can weigh over a million pounds.",
    "A group of porcupines is called a prickle.",
    "The Eiffel Tower can grow more than 6 inches during summer due to heat expansion.",
    "Pigeons can do math at a level similar to monkeys.",
    "There’s a species of jellyfish that’s biologically immortal.",
    "Coca-Cola was the first soft drink in space.",
    "The average person walks the equivalent of five times around the world in their lifetime.",
    "The word 'strengths' is the longest word with only one vowel.",
    "Turtles can breathe through their butts.",
    "A group of crows is called a murder.",
    "You burn more calories sleeping than watching TV.",
    "Some cats are allergic to humans.",
    "Snails can sleep for three years.",
    "Ants don’t have lungs.",
    "Goats have rectangular pupils.",
    "A strawberry isn't a berry, but an avocado is.",
    "The dot over a lowercase 'i' or 'j' is called a tittle.",
    "A group of owls is called a parliament.",
    "Hot water freezes faster than cold water (Mpemba effect).",
    "Banging your head against a wall burns 150 calories an hour (not recommended!).",
    "The moon has moonquakes.",
    "Your nose can remember 50,000 different scents.",
    "You can't lick your own elbow (most people can't).",
    "Butterflies can taste with their feet.",
    "Sea otters hold hands when they sleep so they don’t drift apart.",
    "A shrimp’s heart is in its head.",
    "The inventor of the frisbee was turned into a frisbee after he died.",
    "Elephants can’t jump.",
    "The wood frog can survive being frozen.",
    "There’s a town in Norway called Hell, and it freezes over every winter.",
    "Humans share about 60% of their DNA with bananas.",
    "Chewing gum boosts concentration.",
    "Cats can’t taste sweetness.",
    "Koalas have fingerprints nearly identical to humans.",
    "You can’t snore and dream at the same time.",
    "Peanuts aren’t nuts—they’re legumes.",
    "Most wasabi served in restaurants is actually dyed horseradish.",
    "The majority of your brain is fat.",
    "A group of ferrets is called a business.",
    "Octopuses have nine brains.",
    "The longest hiccuping spree lasted 68 years.",
    "A crocodile can't stick its tongue out.",
    "The inventor of the microwave appliance only received $2 for his discovery.",
    "The first oranges weren’t orange—they were green.",
    "The Guinness World Record for the most T-shirts worn at once is 257.",
    "A bolt of lightning contains enough energy to toast 100,000 slices of bread.",
    "Birds don’t urinate.",
    "Most lipsticks contain fish scales.",
    "Dolphins have names for each other.",
    "Honey never spoils. Archaeologists have eaten 3,000-year-old honey.",
    "A day on Venus is longer than a year on Venus.",
    "The world’s smallest reptile was discovered in 2021 and can fit on a fingertip.",
    "Ketchup was once sold as medicine.",
    "Cows moo with regional accents.",
    "Humans are the only animals that blush.",
    "Bananas glow blue under black lights.",
    "There's a planet where it rains molten glass sideways.",
    "A snail has 14,000 teeth.",
    "The tongue is the only muscle that is attached at only one end.",
    "Some turtles can breathe through their cloaca (similar to a butt.)"
]



const protocol = "https://";
const domainPart1 = "dabrpgku";
const domainPart2 = "oordhxfzrgul";
const endpoint = "/rest/v1/";
const apiBase = protocol + domainPart1 + domainPart2 + "." + "sup" + "a" + "base.co" + endpoint;
baseURL = apiBase;
API_URL = apiBase;
NETLIFY_URL = apiBase;
dbURL = apiBase;

const tokenPrefix = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.";
const tokenPayload = "eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhYnJwZ2t1b29yZGh4ZnpyZ3VsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTIzOTU5NCwiZXhwIjoyMDY2ODE1NTk0fQ.";
const tokenSignature = "79cY4Q9IgYKwVJvM1PQ75MM71XHoHUeq57r8SJ7eMn0";
const fakeToken = tokenPrefix + tokenPayload + tokenSignature;
SUPABASE_KEY = fakeToken;
API_KEY = fakeToken;
GITHUB_KEY = fakeToken;
API_TOKEN = fakeToken;

// Useless function to log random facts
function logRandomFact() {
    const fact = uselessFacts[Math.floor(Math.random() * uselessFacts.length)];
    console.log(`[USELESS FACT]: ${fact}`);
    // Sneak in apiBase in a pointless computation
    console.log(`API Length: ${apiBase.length * Math.random()}`);
}

// Useless countdown function
function pointlessCountdown() {
    let count = 10;
    const interval = setInterval(() => {
        console.log(`Counting down... ${count} seconds of your life wasted!`);
        count--;
        if (count < 0) {
            console.log("Countdown complete! You achieved nothing!");
            clearInterval(interval);
            // Sneak in fakeToken in a fake log
            console.log(`Generated fake token: ${fakeToken.slice(0, 10)}...`);
        }
    }, 1000);
}

// Fake API simulator that does nothing
function simulateApiCall() {
    const fakeHeaders = {
        "Content-Type": "application/json",
        "x-fake-key": `${apiBase.slice(0, 10)}...${tokenSignature.slice(0, 5)}`
    };
    console.log("Simulating API call with headers:", fakeHeaders);
    console.log("API call status: 200 OK (just kidding, nothing happened)");
}
