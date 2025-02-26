import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import promptSync from 'prompt-sync';
const prompt = promptSync();

export default async function aiSearch() {
  console.clear();

  const messages = [];
  messages.push({
    role: 'system',
    content:
      'Du bist ein Assistent, der Orte identifiziert. Nenne in deiner Antwort immer den erkannten Ort explizit in folgendem Format: "LOCATION: [Ortsname] |". Gebe danach eine kurze Info zum Ort. Wenn du keinen Ort findest, dann gebe diese Antwort: "[NO RESULT] - Keinen passenden Ort gefunden."',
  });
  while (true) {
    let input = prompt(
      "Beschreibe den Ort (oder 'x' zum Beenden des Chats): "
    );
    if (input === 'x') return;

    messages.push({ role: 'user', content: input });

    const result = streamText({
      model: openai('gpt-4o'),
      messages,
    });

    // TODOs:
    // - developer prompt mit Einschränkung auf Orte
    // - Umgang mit sinnlosen Anfragen und Ergebnissen

    let fullResponse = '';
    process.stdout.write('\nKI-Assistent: ');
    for await (const delta of result.textStream) {
      fullResponse += delta;
      process.stdout.write(delta);
    }
    process.stdout.write('\n\n');

    messages.push({ role: 'assistant', content: fullResponse });

    // Extract location from the conversation
    const match = fullResponse.match(/LOCATION:\s*([^|]+)\s*\|/);
    const location = match ? match[1].trim() : null;

    // Check if the response contains [NO RESULT]
    const noResultMatch = fullResponse.includes('[NO RESULT]');

    // Only ask for confirmation if a location was found and there's no [NO RESULT]
    if (!noResultMatch && location) {
      const confirmation = prompt(
        `Ist "${location}" der gesuchte Ort? (ja/nein): `
      ).toLowerCase();
      if (confirmation === 'ja' || confirmation === 'j') {
        return location;
      }
    } else {
      console.log(
        'Kein passender Ort gefunden. Bitte versuche es erneut.'
      );
    }

    process.stdout.write('\n\n');
  }
}
