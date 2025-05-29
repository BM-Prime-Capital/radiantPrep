
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Edit3, ShieldCheck, Users, BookOpen, BarChart3, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] py-12 bg-background-page text-foreground-page">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <header className="text-center mb-20 pt-8">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-primary mb-6">
            Radiant Test Prep
          </h1>
          <p className="mt-4 text-xl sm:text-2xl text-foreground/80 max-w-3xl mx-auto leading-relaxed">
            Des évaluations diagnostiques personnalisées pour révéler le potentiel académique de chaque élève en ELA et Mathématiques.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
            <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out">
              <Link href="/auth/login">
                Accès Étudiant <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out">
              <Link href="/auth/register">
                Inscription Parent <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </header>

        {/* Feature Cards Section */}
        <section className="mb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <Card className="shadow-xl hover:shadow-2xl transition-shadow duration-300 ease-in-out bg-card overflow-hidden rounded-xl border-border">
              <CardHeader className="bg-muted/50 p-6 border-b border-border">
                <CardTitle className="flex items-center text-2xl font-bold text-primary">
                  <Users className="mr-3 h-8 w-8 text-accent" /> Pour les Étudiants
                </CardTitle>
                <CardDescription className="text-base text-foreground/70 pt-1">
                  Découvrez vos forces et identifiez les domaines à améliorer grâce à nos tests adaptés.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <ul className="space-y-3 text-foreground/90">
                  {[
                    "Tests diagnostiques personnalisés en ELA et Mathématiques.",
                    "Accès simple et sécurisé avec un code unique.",
                    "Suivez vos progrès et comprenez mieux votre profil d'apprentissage."
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Button asChild className="mt-6 w-full bg-accent hover:bg-accent/90 text-accent-foreground py-3 text-base rounded-lg">
                  <Link href="/auth/login">Commencer une évaluation</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-xl hover:shadow-2xl transition-shadow duration-300 ease-in-out bg-card overflow-hidden rounded-xl border-border">
              <CardHeader className="bg-muted/50 p-6 border-b border-border">
                <CardTitle className="flex items-center text-2xl font-bold text-primary">
                  <Edit3 className="mr-3 h-8 w-8 text-primary" /> Pour Parents & Éducateurs
                </CardTitle>
                <CardDescription className="text-base text-foreground/70 pt-1">
                  Inscrivez votre enfant, obtenez des aperçus de ses performances et soutenez son parcours.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <ul className="space-y-3 text-foreground/90">
                  {[
                    "Processus d'inscription rapide et facile pour votre enfant.",
                    "Recevez un code d'accès unique et sécurisé.",
                    "Identifiez les points forts et les opportunités de croissance."
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Button asChild className="mt-6 w-full py-3 text-base rounded-lg">
                  <Link href="/auth/register">Inscrire mon enfant</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Subjects Section */}
        <section className="w-full max-w-6xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-bold text-primary mb-12">Explorez Nos Matières</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="bg-card p-8 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out border border-border">
              <Image 
                src="https://placehold.co/600x400.png" 
                alt="Évaluation ELA" 
                width={600} 
                height={400} 
                className="rounded-lg mb-6 aspect-video object-cover"
                data-ai-hint="books library" 
              />
              <h3 className="text-2xl font-semibold text-accent mb-3">English Language Arts (ELA)</h3>
              <p className="text-base text-foreground/80 leading-relaxed">
                Évaluez la compréhension écrite, le vocabulaire et les compétences rédactionnelles essentielles à la réussite scolaire.
              </p>
            </div>
            <div className="bg-card p-8 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out border border-border">
              <Image 
                src="https://placehold.co/600x400.png" 
                alt="Évaluation Mathématiques" 
                width={600} 
                height={400} 
                className="rounded-lg mb-6 aspect-video object-cover"
                data-ai-hint="math equations"
              />
              <h3 className="text-2xl font-semibold text-accent mb-3">Mathématiques</h3>
              <p className="text-base text-foreground/80 leading-relaxed">
                Testez l'aisance numérique, les capacités de résolution de problèmes et la maîtrise des concepts mathématiques fondamentaux.
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="text-center py-16">
          <h2 className="text-3xl font-bold text-primary mb-6">Prêt à commencer ?</h2>
          <p className="text-lg text-foreground/80 max-w-xl mx-auto mb-8">
            Rejoignez Radiant Test Prep aujourd'hui et ouvrez la porte à une meilleure compréhension académique.
          </p>
          <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg py-4 px-8 shadow-xl transform hover:scale-105 transition-transform duration-300 ease-in-out">
            <Link href="/auth/register">
              Créer un compte Parent
            </Link>
          </Button>
        </section>
      </div>
    </div>
  );
}

    