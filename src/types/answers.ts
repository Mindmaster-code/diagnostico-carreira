export type SalaryRange = 'up5k' | '5to8' | '8to12' | '12to20' | '20plus';

export type CurrentSituation =
  | 'grow_unknown'
  | 'not_remembered'
  | 'experience_not_shown'
  | 'positioning_below'
  | 'stagnant';

export type ResultsVsFunctions =
  | 'results_clear'
  | 'results_some'
  | 'more_functions'
  | 'never_organized';

export type MarketInbound = 'often' | 'sometimes' | 'rarely' | 'no';

export type LeadershipSignal =
  | 'leadership_clear'
  | 'mixed'
  | 'more_execution'
  | 'no_leadership';

export type InterviewReadiness = 'yes' | 'partial' | 'fragile' | 'no';

export type Fear90Days =
  | 'invisible_promotion'
  | 'below_salary'
  | 'lose_opportunities'
  | 'no_clarity'
  | 'unprepared_interviews'
  | 'others_advance';

export interface Answers {
  email: string;
  currentRole: string;
  desiredRole: string;
  salaryRange: SalaryRange | null;
  currentSituation: CurrentSituation | null;
  resultsVsFunctions: ResultsVsFunctions | null;
  marketInbound: MarketInbound | null;
  leadershipSignal: LeadershipSignal | null;
  interviewReadiness: InterviewReadiness | null;
  fear90Days: Fear90Days | null;
}

export const initialAnswers = (): Answers => ({
  email: '',
  currentRole: '',
  desiredRole: '',
  salaryRange: null,
  currentSituation: null,
  resultsVsFunctions: null,
  marketInbound: null,
  leadershipSignal: null,
  interviewReadiness: null,
  fear90Days: null,
});
