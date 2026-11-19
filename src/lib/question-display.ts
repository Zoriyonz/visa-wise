import type { IntakeQuestion, IntakeQuestionOption } from "@/lib/intake/questionTreeTypes";

interface DisplayOverride {
  match?: (question: IntakeQuestion) => boolean;
  question?: string;
  helpText?: string | null;
  optionLabels?: Record<string, string>;
}

function applyOptionLabels(
  options: IntakeQuestionOption[] | null,
  optionLabels?: Record<string, string>,
): IntakeQuestionOption[] | null {
  if (!options || !optionLabels) {
    return options;
  }

  return options.map((option) =>
    optionLabels[option.value] ? { ...option, label: optionLabels[option.value] } : option,
  );
}

function resolveOverride(question: IntakeQuestion): DisplayOverride | undefined {
  const overrides = OVERRIDE_RULES[question.id];
  if (!overrides) {
    return undefined;
  }

  if (Array.isArray(overrides)) {
    return overrides.find((override) => !override.match || override.match(question));
  }

  return overrides;
}

export function applyDisplayOverrides(question: IntakeQuestion): IntakeQuestion {
  const override = resolveOverride(question);
  if (!override) {
    return question;
  }

  return {
    ...question,
    question: override.question ?? question.question,
    help_text: override.helpText === null ? "" : (override.helpText ?? question.help_text),
    options: applyOptionLabels(question.options, override.optionLabels),
  };
}

const OVERRIDE_RULES: Record<string, DisplayOverride | DisplayOverride[]> = {
  selected_country: {
    question: "Which country are you hoping to immigrate to?",
    helpText: "Start here — everything after this is tailored to your choice.",
    optionLabels: {
      canada: "Canada",
      us: "United States",
    },
  },
  current_country: {
    question: "Where are you living right now?",
    helpText: "This affects which pathways are available to you today.",
    optionLabels: {
      CA: "I'm already in Canada",
      US: "I'm in the United States",
      OTHER: "I'm in another country",
    },
  },
  current_immigration_status: {
    question: "What's your current immigration status where you live?",
    helpText: "Pick the option that best describes your situation right now.",
    optionLabels: {
      citizen: "I'm a citizen of this country",
      pr: "I have permanent residency or a green card",
      study_permit: "I'm on a student visa",
      work_permit_open: "I have an open work permit (any employer)",
      work_permit_closed: "I have a work permit tied to one employer",
      visitor: "I'm here as a visitor or tourist",
      undocumented: "I don't have legal status here",
      none: "I live outside my destination country",
    },
  },
  primary_goal: [
    {
      match: (question) => question.question.includes("citizen"),
      question: "You're already a citizen. What brings you here?",
      helpText: null,
      optionLabels: {
        permanent_residence: "Get permanent residency",
        work_permit: "Get a work permit",
        study_permit: "Study in Canada",
      },
    },
    {
      match: (question) => question.question.includes("already have permanent residence"),
      question: "You already have permanent residency. What are you looking for?",
      helpText: null,
      optionLabels: {
        work_permit: "Get a work permit",
        study_permit: "Study in Canada",
      },
    },
    {
      match: (question) => question.question.includes("main immigration goal"),
      question: "What's your main immigration goal?",
      helpText: "Pick the one that matters most to you right now.",
      optionLabels: {
        permanent_residence: "Get permanent residency",
        work_permit: "Get a work permit",
        study_permit: "Study in Canada",
      },
    },
  ],
  country_of_birth: {
    question: "What country were you born in?",
    helpText: "Your birth country can affect eligibility for certain pathways.",
  },
  age: {
    question: "How old are you?",
    helpText: "Age affects your score in Canada's points-based immigration system.",
  },
  marital_status: {
    question: "What's your relationship status?",
    helpText: "This affects which family pathways are available to you.",
    optionLabels: {
      single: "Single",
      married: "Married",
      common_law: "Living with a partner (common-law, 12+ months)",
      separated: "Separated",
      divorced: "Divorced",
      widowed: "Widowed",
    },
  },
  spouse_status: {
    match: (question) => question.question.includes("Canada"),
    question: "What's your spouse or partner's status in Canada?",
    helpText: "A Canadian citizen or PR spouse could open the fastest pathway to residency.",
    optionLabels: {
      citizen: "Canadian citizen",
      permanent_resident: "Canadian permanent resident",
      in_destination: "In Canada on a visa or permit",
      abroad: "Outside Canada",
      applying_with_me: "Applying together with me",
    },
  },
  education_level: {
    question: "What's the highest level of education you've completed?",
    helpText: "Only count degrees or diplomas you've fully finished.",
    optionLabels: {
      less_than_secondary: "Less than high school",
      secondary: "High school diploma",
      trade_certificate: "Trade certificate or apprenticeship",
      one_year_post_secondary: "1-year college certificate",
      two_year_post_secondary: "2-year college diploma",
      bachelors: "Bachelor's degree",
      two_or_more_degrees: "Two or more degrees (one 3+ years)",
      masters: "Master's degree",
      phd: "PhD or doctorate",
    },
  },
  education_country: {
    question: "Where did you complete your highest degree?",
    helpText:
      "Canadian credentials are automatically recognized. Foreign ones may need an evaluation.",
    optionLabels: {
      canada: "In Canada",
      us: "In the United States",
      other: "In another country",
    },
  },
  credential_recognized: {
    question: "Has your foreign degree been officially evaluated in Canada or the US?",
    helpText:
      "This is called an ECA (Educational Credential Assessment). Common providers: WES, IQAS.",
    optionLabels: {
      yes: "Yes — I have a completed evaluation",
      in_progress: "I've started it but it's not done yet",
      no: "No, not yet",
    },
  },
  education_field: {
    question: "What field is your education or work in?",
    helpText: "Some fields get priority in Canadian immigration draws.",
    optionLabels: {
      stem: "Science, tech, engineering, or math (STEM)",
      healthcare: "Healthcare or medicine",
      business_finance: "Business or finance",
      law: "Law",
      trades: "Skilled trades",
      education_teaching: "Education or teaching",
      arts_humanities: "Arts, humanities, or social sciences",
      other: "Something else",
    },
  },
  total_work_years: {
    question: "How many years of full-time work experience do you have?",
    helpText: "Count paid, skilled jobs only. Don't count internships or student jobs.",
  },
  destination_work_years: {
    question: "How many of those years were spent working in Canada?",
    helpText: "Only count time physically working in Canada on a valid permit.",
  },
  noc_teer_level: {
    question: "Which best describes the type of work you do?",
    helpText: "Pick the closest match — don't overthink it.",
    optionLabels: {
      teer0: "I manage teams or run an organization",
      teer1:
        "I work in a profession needing a university degree (e.g. engineer, developer, doctor)",
      teer2: "I work in a technical or supervisory role (e.g. technician, supervisor)",
      teer3: "I work in a skilled trade (e.g. chef, electrician, dental assistant)",
      teer4: "I work in a role with on-the-job training (e.g. retail, support work)",
      teer5: "I do general or entry-level labour",
    },
  },
  job_offer: {
    match: (question) => question.question.includes("Canadian employer"),
    question: "Do you have a job offer from a Canadian employer?",
    helpText: "Even a verbal offer counts — just pick the closest option.",
    optionLabels: {
      lmia_approved: "Yes — they have an approved LMIA document",
      lmia_exempt: "Yes — they're exempt from LMIA (e.g. intra-company)",
      pending: "Sort of — I'm in talks but nothing confirmed",
      none: "No job offer",
    },
  },
  employer_type: {
    question: "What type of organisation is offering you the job?",
    helpText: "Universities and nonprofits have special visa advantages in Canada.",
    optionLabels: {
      large_corporation: "A large company (1,000+ employees)",
      small_medium: "A small or medium business",
      university_nonprofit: "A university, research institute, or nonprofit",
      self_employed: "I'd be self-employed",
    },
  },
  english_level: {
    question: "How well do you speak and understand English?",
    helpText: "Be honest — this helps us match you to the right pathways.",
    optionLabels: {
      none: "Little to none",
      basic: "Basic — simple conversations only",
      intermediate: "Intermediate — comfortable day-to-day",
      proficient: "Proficient — confident in professional settings",
      advanced: "Advanced — near-native fluency",
      native: "English is my first language",
    },
  },
  english_test: {
    question: "Have you taken an official English language test?",
    helpText: "You'll need IELTS General or CELPIP for most Canadian PR applications.",
    optionLabels: {
      ielts: "Yes — IELTS General Training",
      toefl: "Yes — TOEFL iBT",
      none: "No, not yet",
    },
  },
  french_level: {
    question: "How well do you speak French?",
    helpText: "French speakers get bonus points and access to special draws with lower cutoffs.",
    optionLabels: {
      none: "I don't speak French",
      basic: "Just a few words and phrases",
      intermediate: "Can hold a basic conversation",
      proficient: "Comfortable in most French situations",
      advanced: "Advanced — near-native fluency",
      native: "French is my first language",
    },
  },
  french_test: {
    question: "Have you taken an official French language test?",
    helpText: "TEF Canada and TCF Canada are both accepted by IRCC.",
    optionLabels: {
      tef: "Yes — TEF (Test d'évaluation de français)",
      tcf: "Yes — TCF (Test de connaissance du français)",
      none: "No, not yet",
    },
  },
  net_worth_usd: {
    question: "Roughly what is your total net worth in US dollars?",
    helpText: "This is only used to check eligibility for investor and entrepreneur pathways.",
    optionLabels: {
      under_10k: "Under $10,000",
      "10k_50k": "$10,000 – $50,000",
      "50k_200k": "$50,000 – $200,000",
      "200k_1m": "$200,000 – $1,000,000",
      over_1m: "Over $1,000,000",
    },
  },
  prior_removal: {
    question: "Have you ever been deported or asked to leave Canada?",
    helpText: "Be honest — there are often solutions even if the answer is yes.",
    optionLabels: {
      true: "Yes",
      false: "No",
    },
  },
  criminal_history: {
    question:
      "Have you ever been arrested, charged, or convicted of a crime — anywhere in the world?",
    helpText: "This includes minor offences. Many are solvable — but we need to know.",
    optionLabels: {
      true: "Yes",
      false: "No",
    },
  },
};
