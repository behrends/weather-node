import { styleText } from 'node:util';
import OpenAI from 'openai';
import promptSync from 'prompt-sync';
import showWeatherForLocation from './lib/weather-location.js';

const openai = new OpenAI();
const prompt = promptSync();

const cities = [
  {
    id: 1,
    name: 'Basel',
  },
  {
    id: 2,
    name: 'Freiburg',
  },
  {
    id: 3,
    name: 'Lörrach',
  },
  {
    id: 4,
    name: 'Oslo',
  },
  {
    id: 5,
    name: 'Sydney',
  },
];

// Hauptmenü
async function mainMenu() {
  let output = styleText(
    'cyan',
    "Das Programm kann mit der Eingabe 'x' beendet werden."
  );
  console.log(output);
  while (true) {
    console.clear();
    console.log(`
      ***** Hauptmenü *****
      1 - Ort eingeben
      2 - Stadt wählen
      3 - KI-Suche
      x - Programm beenden 
     `);
    let input = promptWithExit('Deine Eingabe: ');
    if (input === '1') {
      input = promptWithExit('Ort eingeben: ');
      await showWeatherForLocation(input);
    } else if (input === '2') {
      console.log(`***** Stadt wählen *****`);
      cities.forEach((city) => {
        console.log(`${city.id} - ${city.name}`);
      });
      input = promptWithExit('Deine Eingabe: ');
      const city = cities.find((city) => city.id === parseInt(input));
      if (!city) {
        console.log('Ungültige Eingabe.');
      } else {
        await showWeatherForLocation(city.name);
      }
    } else if (input === '3') {
      input = promptWithExit('Beschreibe den Ort: ');
      const searchResult = await askAIForLocation(input);
      if (searchResult === 'no result') {
        console.log(`Kein Ort gefunden für "${input}"`);
      } else {
        await showWeatherForLocation(searchResult, input);
      }
    } else {
      console.log('Bitte gib 1, 2 oder x ein.');
    }
    promptWithExit('Weiter mit Enter');
  }
}

async function askAIForLocation(input) {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: 'developer',
        content:
          'Du bekommst Beschreibungen von Orten und lieferst nur die passende Stadt. Wenn du keine Stadt findest, dann antwortest du mit "no result". Sonst gibst du mir keine weiteren Texte.',
      },
      { role: 'user', content: input },
    ],
    model: 'gpt-4o-mini',
  });
  return completion.choices[0].message.content;
}

// Eingabe mit Prompt und Test, ob Programm beendet werden soll
function promptWithExit(message) {
  const input = prompt(message);
  if (input === 'x') {
    let output = styleText('cyan', 'Auf Wiedersehen!');
    console.log(output);
    process.exit(0);
  }
  return input;
}

// starte Hauptmenü
console.log('Willkommen zur Wetter-App!');
mainMenu();
