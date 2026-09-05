import { pilotScope } from "./pilot";

export const welcomeSlides = [
  {
    id: "welcome",
    tab: "Welcome",
    title: "Welcome aboard",
    body: "LAMLA is a student-centered academic intelligence workspace. This first pilot is for a defined KNUST Computer Science path, not a generic chatbot.",
    points: [
      pilotScope.institution,
      pilotScope.department,
      pilotScope.programme,
    ],
  },
  {
    id: "about",
    tab: "About LAMLA",
    title: "Grounded, not guessed",
    body: "A question is understood through academic context, authorized sources, and past papers when those records exist. If the corpus is empty, LAMLA refuses instead of inventing KNUST material.",
    points: [
      "Text, voice, and image share one engine",
      "Answers must cite authorized sources",
      "No invented lecture notes or exam papers",
    ],
  },
  {
    id: "join",
    tab: "Get started",
    title: "Create an account to continue",
    body: "Sign up or sign in next. New accounts start as students. Staff assign the official programme later. After that you reach the homepage and workspaces.",
    points: [
      "Students can set a display name",
      "Role and programme stay staff-controlled",
      "Authorized sources are still required before answers",
    ],
  },
] as const;

export const welcomeCookieName = "lamla-welcome";
export const welcomeCookieValue = "seen";
