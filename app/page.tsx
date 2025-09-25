import Link from "next/link";
import {
  Activity,
  CreditCard,
  DollarSign,
  Download,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Simplify Your Group Expenses with Qesma
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Qesma is the easiest way to split bills and manage shared
                    expenses with friends, family, and roommates.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg">
                    <Link href="/dashboard">Get Started</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="#features">Learn More</Link>
                  </Button>
                </div>
              </div>
              <img
                src="/placeholder.svg"
                alt="Hero"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square"
              />
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted-foreground px-3 py-1 text-sm text-background">
                  Key Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Everything You Need to Settle Up
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  From creating groups and tracking expenses to settling debts,
                  Qesma has you covered.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="grid gap-1">
                <Users className="h-8 w-8 text-primary" />
                <h3 className="text-xl font-bold">Groups</h3>
                <p className="text-muted-foreground">
                  Create groups for any occasion and invite friends to join.
                </p>
              </div>
              <div className="grid gap-1">
                <CreditCard className="h-8 w-8 text-primary" />
                <h3 className="text-xl font-bold">Expense Tracking</h3>
                <p className="text-muted-foreground">
                  Log expenses and split them with group members in just a few
                  taps.
                </p>
              </div>
              <div className="grid gap-1">
                <DollarSign className="h-8 w-8 text-primary" />
                <h3 className="text-xl font-bold">Debt Settlement</h3>
                <p className="text-muted-foreground">
                  Qesma calculates who owes what, making it easy to settle up.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container grid items-center gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-10">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                How It Works
              </h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Getting started with Qesma is as easy as 1-2-3.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-bold">Create a Group</h3>
                  <p className="text-muted-foreground">
                    Start by creating a group for your trip, household, or any
                    other shared expenses.
                  </p>
                </div>
              </div>
              <Separator />
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-bold">Add Expenses</h3>
                  <p className="text-muted-foreground">
                    Log your expenses and split them with your group members.
                  </p>
                </div>
              </div>
              <Separator />
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-bold">Settle Up</h3>
                  <p className="text-muted-foreground">
                    Qesma simplifies your balances into the easiest to repay
                    debts.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                What Our Users Say
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Don't just take our word for it. Here's what our users have
                to say about Qesma.
              </p>
            </div>
            <div className="grid w-full grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>John Doe</CardTitle>
                      <CardDescription>
                        Co-founder, Acme Inc.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    "Qesma has been a lifesaver for our group trips. No more
                    spreadsheets or complicated calculations."
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback>JA</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>Jane Appleseed</CardTitle>
                      <CardDescription>
                        Marketing Manager, Qesma
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    "I use Qesma with my roommates to split bills, and it has
                    made our lives so much easier."
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback>SM</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>Sarah Miller</CardTitle>
                      <CardDescription>Student</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    "Qesma is a must-have for any group of friends who want to
                    keep track of their shared expenses."
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Qesma. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link
            href="#"
            className="text-xs hover:underline underline-offset-4"
            prefetch={false}
          >
            Terms of Service
          </Link>
          <Link
            href="#"
            className="text-xs hover:underline underline-offset-4"
            prefetch={false}
          >
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}