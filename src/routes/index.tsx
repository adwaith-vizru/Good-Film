import { createFileRoute } from "@tanstack/react-router";
import { ReelRefineStudio } from "../components/reelrefine/ReelRefineStudio";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ReelRefine Studio — AI Screenplay Intelligence & Production Hub" },
      {
        name: "description",
        content:
          "ReelRefine Studio: AI screenplay analysis, scene rewrites, character breakdowns, visual storyboards, casting shortlists, and production packages.",
      },
      { property: "og:title", content: "ReelRefine Studio — AI Screenplay Intelligence & Production Hub" },
      {
        property: "og:description",
        content: "Screenplay review, scene breakdowns, AI storyboards, casting shortlists, and budget planning.",
      },
    ],
  }),
  component: ReelRefineStudio,
});
