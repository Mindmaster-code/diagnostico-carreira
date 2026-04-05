interface QuestionStepMetaProps {
  current: number;
  total: number;
  className?: string;
}

export function QuestionStepMeta({ current, total, className }: QuestionStepMetaProps) {
  return (
    <p className={`mm-question-meta ${className ?? ''}`.trim()}>
      <span className="sr-only">
        Pergunta {current} de {total}
      </span>
      <span className="mm-question-meta__dots" aria-hidden="true">
        {Array.from({ length: total }, (_, i) => (
          <span key={i} className={i + 1 <= current ? 'is-done' : ''} />
        ))}
      </span>
      <span className="mm-question-meta__label" aria-hidden="true">
        {current} de {total}
      </span>
    </p>
  );
}
