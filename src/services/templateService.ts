export interface EmailTemplate {
  id: number;
  name: string;
  subjects: string[];
  body: string;
  cadenceDays: number;
}

export const EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: 1,
    name: "The Pattern Interrupt",
    subjects: [
      "Quick question about {CompanyName}’s scheduling",
      "{FirstName}, 2 minutes for {CompanyName}?",
      "Saw {CompanyName} on {Source}",
      "This might not be relevant…"
    ],
    body: `{FirstName},

I recorded a quick 90-second video for you rather than writing a long email:

[LOOM VIDEO THUMBNAIL/LINK]

TL;DR - I help {Industry} businesses like {CompanyName} replace the chaos of juggling 6 different apps with one custom mobile app. 

We've built systems for similar companies, and they're completing 15-25% more jobs with the same team.

Worth a 15-minute conversation?

Whitney Wilson
Backbone Custom Development
(646) 444-4131 | https://calendly.com/whitneywilson1227/30min

P.S. If this isn't relevant, just let me know and I won't follow up again.`,
    cadenceDays: 0
  },
  {
    id: 2,
    name: "The Value-First Follow-Up",
    subjects: [
      "Following up - free resource for {CompanyName}",
      "{FirstName}, forgot to attach this",
      "Quick workflow tip for {Industry} businesses"
    ],
    body: `{FirstName},

I sent a video last week but realized I didn't include something that might be immediately helpful even if we never talk.

I put together a quick checklist we use with {Industry} businesses to identify where they're losing the most time to operational chaos:

→ "The 7 Signs You're Outgrowing Spreadsheets & Sticky Notes"
[Link to PDF or Google Doc]

Takes 2 minutes to go through. If 4+ of these sound familiar, you'd probably benefit from what we build at Backbone.

And if you want to talk through it, my calendar's here: https://calendly.com/whitneywilson1227/30min

Whitney Wilson
Backbone
Founder | Developer 

P.S. We just launched a new {Industry} company in Colorado last week - happy to show you what we built if you're curious.`,
    cadenceDays: 3
  },
  {
    id: 3,
    name: "The Case Study",
    subjects: [
      "How similar companies added $80K in revenue",
      "Case study: {Industry} business transformation",
      "{FirstName}, this might resonate"
    ],
    body: `{FirstName},

I know you're busy, so I'll keep this short.

A {Industry} company similar to {CompanyName} came to us 6 months ago with the same challenge most businesses have: too many tools, too much manual work, not enough visibility.

Here's what changed after we built their custom app:

• 23% more jobs completed (better routing = less drive time)
• 15 hours/week saved on admin (automated invoicing)
• 87% same-day payment collection (up from 30%)
• ROI in 6 weeks

I put together a 2-minute case study breakdown here: [link]

If you're dealing with similar challenges, let's talk. Even if you decide it's not the right fit, I can share what worked for them that you might apply on your own.

Book A Call: https://calendly.com/whitneywilson1227/30min

Whitney Wilson
Backbone
Founder | Developer 

P.S. The owner said the best part was finally being able to take a day off without his phone blowing up. Might be worth it for that alone.`,
    cadenceDays: 4
  },
  {
    id: 4,
    name: "The Different Angle",
    subjects: [
      "Not sure if you saw my previous emails…",
      "Different question for {CompanyName}",
      "{FirstName}, trying one more time"
    ],
    body: `{FirstName},

I've reached out a few times about building a custom app for {CompanyName}, but I'm realizing I might be approaching this wrong.

Let me ask a different question:

If you could wave a magic wand and fix ONE operational headache in your business right now, what would it be?

• Scheduling chaos?
• Manual invoicing?
• Tracking customer history?
• Getting paid on time?
• Something else entirely?

Hit reply and tell me. Even if we never work together, I'll send you 2-3 things you can do THIS WEEK to improve it (no sales pitch).

I mean it - just genuinely want to help.

Whitney Wilson
Backbone
Founder | Developer
(646) 444-4131

P.S. If I'm being annoying and you want me to stop emailing, just reply "Not interested" and I'll remove you from my list. No hard feelings.`,
    cadenceDays: 4
  },
  {
    id: 5,
    name: "The Limited Availability",
    subjects: [
      "Quick update - March availability",
      "Heads up about Q2 schedule",
      "{FirstName}, not sure if you’re still interested…"
    ],
    body: `{FirstName},

I wanted to give you a heads-up before you hear about this elsewhere.

We typically onboard 4-6 new clients per month at Backbone, and we're currently at capacity for March.

I have **2 slots opening up in early April** for new builds.

If you've been on the fence about building a custom app for {CompanyName}, now's the time to lock in your spot.

Here's what the timeline would look like:

• Week of April 7: Discovery call & design mockups
• Week of April 14: Development sprint (you test daily builds)
• Week of April 21: Launch & training
• By May 1: Your team is using the app

If you want one of these April slots, reply "Interested" and I'll send over calendar options for a 15-minute scoping call.

If timing doesn't work or you're not interested, no worries - just let me know so I can offer the slot to someone else.

Whitney Wilson
Backbone
Founder | Developer

P.S. If you missed my earlier emails and have no idea what I'm talking about, here's a 90-second overview: [Loom link]`,
    cadenceDays: 6
  },
  {
    id: 6,
    name: "The Breakup",
    subjects: [
      "Should I close your file?",
      "Last email, I promise",
      "Breaking up is hard to do…"
    ],
    body: `{FirstName},

I've reached out a few times over the past month about building a custom app for {CompanyName}.

Radio silence on your end, which I totally get - you're busy running a business.

So here's what I'm thinking:

**Option 1:** You're genuinely not interested  
→ Reply "Not interested" and I'll close your file. No hard feelings.

**Option 2:** You're interested but timing is bad  
→ Reply "Not now" and I'll check back in 3 months.

**Option 3:** You're interested but have questions  
→ Reply "Let's talk" and I'll send my calendar.

Just pick one and hit reply. Saves us both time.

Whitney Wilson
Backbone
Founder | Developer
(646) 444-4131

P.S. If I don't hear back, I'll assume Option 1 and won't bother you again. Thanks for your time either way.`,
    cadenceDays: 6
  },
  {
    id: 7,
    name: "Permission to Persist",
    subjects: [
      "{FirstName}, checking back in",
      "Following up from 3 months ago"
    ],
    body: `{FirstName},

We spoke 3 months ago about building a custom app for {CompanyName}, and you asked me to check back in this month.

A lot can change in 3 months, so I'm curious:

1. Is there an operational challenge still an issue?
2. Are you still juggling multiple tools to run operations?
3. Is now a better time to explore a solution?

If yes, let's reconnect: https://calendly.com/whitneywilson1227/30min

If no, just let me know and I'll check back in another quarter.

Whitney Wilson
Backbone
Founder | Developer
(646) 444-4131

P.S. Since we last talked, we've built 8 new apps for similar businesses. Happy to show you what's possible.`,
    cadenceDays: 7
  },
  {
    id: 8,
    name: "The Final Final Goodbye",
    subjects: [
      "Officially closing your file",
      "Last time, I promise (for real this time)"
    ],
    body: `{FirstName},

I've followed up a few times over the past timeframe about building a custom app for {CompanyName}.

Since I haven't heard back, I'm going to officially close your file and stop reaching out.

But before I do, I want to leave you with something useful:

[Link to free resource: checklist, guide, or video tutorial]

If you ever change your mind down the road, you know where to find me: whitney@backbone.dev | (646) 444-4131

Best of luck with {CompanyName} - I hope business is crushing it.

Whitney Wilson
Backbone
Founder | Developer
(646) 444-4131`,
    cadenceDays: 10
  }
];

export interface TemplateData {
  name?: string;
  industry?: string;
  source?: string;
}

export function populateTemplate(templateId: number, data: TemplateData) {

  const template = EMAIL_TEMPLATES.find(t => t.id === templateId);
  if (!template) return { subject: '', body: '' };

  const replacePlaceholders = (text: string) => {
    return text
      .replace(/{FirstName}/g, data.name?.split(' ')[0] || 'there')
      .replace(/{CompanyName}/g, data.name || 'your company')
      .replace(/{Industry}/g, data.industry || 'your industry')
      .replace(/{Source}/g, data.source || 'our research');
  };

  return {
    subject: replacePlaceholders(template.subjects[0]), // Default to first subject
    body: replacePlaceholders(template.body)
  };
}
