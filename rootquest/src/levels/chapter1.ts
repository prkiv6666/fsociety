import type { Level } from "./types";

// ─────────────────────────────────────────────────────────────
// Chapter 1: every level is plain data. To add a level, copy one of
// these objects, give it a new id, and change the content.
// All companies, domains and people below are fictional.
// ─────────────────────────────────────────────────────────────

export const chapter1: Level[] = [
  {
    id: 1,
    title: "Spot the phish",
    free: true,
    briefing:
      "This email just landed in your inbox. It claims to be from your payment app, NovaPay. Something feels off. Find the red flags before you click anything.",
    hints: [
      "Don't trust the sender's display name. Look at the actual email address after it.",
      "Classic red flags: a weird sender domain, pressure to act fast, a link that goes somewhere unexpected, and a file that isn't what it says.",
    ],
    flag: "FLAG{n3v3r_trust_urg3ncy}",
    puzzle: {
      type: "hotspots",
      instruction: "Tap anything that looks suspicious. Find 3 red flags.",
      required: 3,
      doc: {
        kind: "email",
        headers: [
          { label: "From", value: ["NovaPay Security <", { spot: "sender", text: "security@novapay-account-alerts.co" }, ">"] },
          { label: "To", value: [{ spot: "to", text: "you@example.com" }] },
          { label: "Date", value: [{ spot: "date", text: "Tue, 18 Nov 2026 09:14" }] },
          { label: "Subject", value: ["Action required on your account"] },
        ],
        body: [
          [{ spot: "greeting", text: "Dear Valued Customer," }],
          [
            "We detected unusual sign-in activity on your NovaPay account. ",
            { spot: "urgency", text: "If you do not verify your identity within 24 hours, your account will be permanently suspended." },
          ],
          ["Verify now: ", { spot: "link", text: "http://novapay.account-verify-login.net/secure" }],
          ["Your latest statement is attached: ", { spot: "attachment", text: "📎 Statement_November.pdf.exe" }],
          [{ spot: "signoff", text: "Thank you, NovaPay Support Team" }],
          [{ spot: "footer", text: "© 2026 NovaPay Inc. · Privacy · Unsubscribe" }],
        ],
      },
      spots: {
        sender: {
          correct: true,
          explain: "The name says NovaPay, but the address is novapay-account-alerts.co. A real company emails from its own domain (novapay.com).",
        },
        urgency: {
          correct: true,
          explain: "Panic is a tool. \"Act in 24 hours or lose everything\" is meant to make you click before you think.",
        },
        link: {
          correct: true,
          explain: "The real domain is the end part: account-verify-login.net. \"novapay\" at the front is just decoration. It's also plain http, not https.",
        },
        attachment: {
          correct: true,
          explain: "\".pdf.exe\" is a program pretending to be a PDF. Opening it would run code on your computer.",
        },
        greeting: {
          correct: true,
          explain: "\"Dear Valued Customer\": your real provider usually knows your name. Mass phishing can't.",
        },
        to: { correct: false, explain: "That's just your own address. Nothing suspicious." },
        date: { correct: false, explain: "A normal timestamp. Not a red flag." },
        signoff: { correct: false, explain: "A sign-off is normal, even in real emails. Look elsewhere." },
        footer: { correct: false, explain: "Footers are easy to copy, so they prove nothing either way. Not the giveaway here." },
      },
    },
    lesson: {
      title: "Phishing: the attack that targets people, not computers",
      body: [
        "Phishing is a fake message that tries to get you to click a link, open a file, or type your password. It's the most common way real breaches start, because tricking a person is easier than breaking encryption.",
        "Attackers copy logos and wording perfectly, so judge an email by what they can't fake: the sender's real domain, where links actually go, and what attachments really are. Urgency and fear are deliberate, they want you to skip thinking.",
      ],
      realWorld:
        "Never log in from an email link. Open the app or type the website yourself. If an email scares you, that's the moment to slow down.",
    },
  },

  {
    id: 2,
    title: "Lookalike domain",
    free: true,
    briefing:
      "You need to log in to Harborline Bank. Your card says the website is harborlinebank.com. A search turned up five addresses. Only one is really the bank.",
    hints: [
      "Find the real domain: it's the part just before the first single \"/\" (ignore https://). Read that part from right to left.",
      "Watch for swapped characters (0 for o), extra words, and a different ending like .co or .net.",
    ],
    flag: "FLAG{r3ad_th3_d0ma1n}",
    puzzle: {
      type: "choice",
      prompt: "Which address really belongs to Harborline Bank?",
      context: "Real website: harborlinebank.com",
      mono: true,
      answer: "c",
      options: [
        {
          id: "a",
          label: "https://harborlinebank.com.account-check.net/login",
          explain: "Tricky! The domain ends in account-check.net. Everything before it, including \"harborlinebank.com\", is a subdomain the attacker chose.",
        },
        {
          id: "b",
          label: "https://harb0rlinebank.com/login",
          explain: "Look closely: harb0rline uses a zero instead of the letter o. This is called typosquatting.",
        },
        {
          id: "c",
          label: "https://harborlinebank.com/login",
          explain: "Correct. The domain right before the first \"/\" is exactly harborlinebank.com, and it uses https.",
        },
        {
          id: "d",
          label: "http://harborline-bank-secure.com/login",
          explain: "Different domain (with hyphens and \"secure\" added), and plain http. Words like \"secure\" in a URL prove nothing.",
        },
        {
          id: "e",
          label: "https://login.harborlinebank.co/secure",
          explain: "Ends in .co, not .com. One missing letter makes it a completely different website, owned by someone else.",
        },
      ],
    },
    lesson: {
      title: "How to read a URL like a pro",
      body: [
        "In https://login.example.com/page, the real owner is example.com: the last two parts just before the first single slash. Anything to the left (login., or even a fake \"yourbank.com.\") is a subdomain that the owner of example.com controls.",
        "Attackers register lookalikes: swapped characters (0/o, rn/m), extra words (-secure, -login), or different endings (.co instead of .com). Some even use letters from other alphabets that look identical, called a homograph attack.",
      ],
      realWorld:
        "Use bookmarks for important sites. Password managers help too: they won't autofill your password on a lookalike domain, which is a great warning sign.",
    },
  },

  {
    id: 3,
    title: "Caesar's secret",
    free: true,
    briefing:
      "You intercepted a note passed between two insiders. It looks like gibberish, but it's an old trick: every letter was moved the same number of places in the alphabet. Turn the wheel to decode it.",
    hints: [
      "Short words are clues. A three-letter word that shows up often in English is THE.",
      "If \"AOL\" decodes to \"THE\", then A→T. Count backwards from A to T: that's a shift of 7.",
    ],
    flag: "FLAG{v3n1_v1d1_d3c0d3d}",
    puzzle: {
      type: "cipher",
      // "MEET ME AT THE OLD SERVER ROOM AT MIDNIGHT", each letter moved 7 forward
      ciphertext: "TLLA TL HA AOL VSK ZLYCLY YVVT HA TPKUPNOA",
      shift: 7,
    },
    lesson: {
      title: "Caesar ciphers, and why they're not real security",
      body: [
        "A Caesar cipher shifts every letter by the same amount. Julius Caesar reportedly used a shift of 3. It's a substitution cipher: each letter is swapped for another one.",
        "It's easy to break: there are only 25 possible shifts, so a computer (or a patient human with a wheel) can try them all in seconds. That's called a brute-force attack. You can also use frequency analysis: E, T and A are the most common letters in English.",
        "Modern encryption like AES has so many possible keys that trying them all would take longer than the age of the universe.",
      ],
      realWorld:
        "If something you use says your data is \"encrypted\" with a home-made scheme instead of a standard like AES or TLS, be suspicious. Good crypto is public and well tested.",
    },
  },
];
