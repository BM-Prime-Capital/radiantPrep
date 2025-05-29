
'use server';
/**
 * @fileOverview Generates a secure and unique access code for a child.
 *
 * - generateSecureAccessCode - A function that generates a secure access code for a child.
 * - SecureAccessCodeInput - The input type for the generateSecureAccessCode function.
 * - SecureAccessCodeOutput - The return type for the generateSecureAccessCode function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SecureAccessCodeInputSchema = z.object({
  childName: z.string().describe('The name of the child.'),
  grade: z.number().describe('The grade level of the child.'),
  subject: z.string().describe('The subject the child will be assessed on (ELA or Math).'),
});
export type SecureAccessCodeInput = z.infer<typeof SecureAccessCodeInputSchema>;

const SecureAccessCodeOutputSchema = z.object({
  accessCode: z.string().describe('The unique access code for the child.'),
});
export type SecureAccessCodeOutput = z.infer<typeof SecureAccessCodeOutputSchema>;

export async function generateSecureAccessCode(input: SecureAccessCodeInput): Promise<SecureAccessCodeOutput> {
  return secureAccessCodeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'secureAccessCodePrompt',
  input: {schema: SecureAccessCodeInputSchema},
  output: {schema: SecureAccessCodeOutputSchema},
  prompt: `Generate a secure and unique access code for {{childName}} who is in grade {{grade}} and will be assessed on {{subject}}. The access code should be a combination of letters and numbers, and should be difficult to guess or predict, and easy to read and type.

Access Code: `,
});

const secureAccessCodeFlow = ai.defineFlow(
  {
    name: 'secureAccessCodeFlow',
    inputSchema: SecureAccessCodeInputSchema,
    outputSchema: SecureAccessCodeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
