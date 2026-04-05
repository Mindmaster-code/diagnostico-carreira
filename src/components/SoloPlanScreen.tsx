import { MASTERFLOW_URL } from '../config';

interface SoloPlanScreenProps {
  onBack?: () => void;
}

function BlockChips({ effort, risk }: { effort: string; risk: string }) {
  return (
    <div className="mm-solo2-block__chips" aria-label="Esforço e risco">
      <span className="mm-solo2-chip mm-solo2-chip--effort">{effort}</span>
      <span className="mm-solo2-chip mm-solo2-chip--risk">{risk}</span>
    </div>
  );
}

export function SoloPlanScreen({ onBack }: SoloPlanScreenProps) {
  return (
    <div className="mm-step-enter mm-solo2">
      <p className="mm-solo2__brand">MindMaster</p>
      <h1 className="mm-solo2__title">SE VOCÊ FOR FAZER SOZINHO, É ISSO QUE VAI TER QUE ENCARAR</h1>
      <p className="mm-solo2__sub">
        O problema não é só saber o que corrigir. É corrigir na ordem certa.
      </p>

      <div className="mm-solo2-blocks">
        <article className="mm-solo2-block">
          <h2 className="mm-solo2-block__title">MELHORAR SUA APRESENTAÇÃO</h2>
          <p className="mm-solo2-block__lead">Seu perfil hoje não te vende no nível que você quer disputar.</p>
          <ul className="mm-solo2-block__list">
            <li>Headline fraca ou genérica</li>
            <li>Resumo que não pesa</li>
            <li>Experiências que listam tarefa, mas não impõem resultado</li>
            <li>Pouca percepção de liderança</li>
            <li>Falta de linguagem de senioridade</li>
          </ul>
          <BlockChips effort="ESFORÇO: MÉDIO" risk="RISCO DE ERRO: ALTO" />
        </article>

        <article className="mm-solo2-block">
          <h2 className="mm-solo2-block__title">PARAR DE PARECER MENOR DO QUE VOCÊ É</h2>
          <p className="mm-solo2-block__lead">
            Você quer um cargo maior, mas sua carreira ainda pode estar te deixando com cara de executor.
          </p>
          <ul className="mm-solo2-block__list">
            <li>Descompasso entre cargo atual e cargo desejado sem ponte convincente</li>
            <li>Salário desejado sem sustentação clara</li>
            <li>Pouca autoridade percebida</li>
            <li>Sinais fracos de decisão e direção</li>
            <li>Narrativa abaixo do nível que você quer ocupar</li>
          </ul>
          <BlockChips effort="ESFORÇO: ALTO" risk="RISCO DE ERRO: ALTO" />
        </article>

        <article className="mm-solo2-block">
          <h2 className="mm-solo2-block__title">PREPARAR-SE PARA VENCER NAS ENTREVISTAS</h2>
          <p className="mm-solo2-block__lead">
            Quando a oportunidade vier, você vai precisar se sustentar sem tropeçar.
          </p>
          <ul className="mm-solo2-block__list">
            <li>Resultados concretos prontos para prova</li>
            <li>Exemplos fortes para entrevista</li>
            <li>Argumentos para promoção e salário</li>
            <li>Clareza sobre diferencial real</li>
            <li>Ordem certa de execução para não gerar retrabalho</li>
          </ul>
          <BlockChips effort="ESFORÇO: ALTO" risk="RISCO DE ERRO: MUITO ALTO" />
        </article>
      </div>

      <section className="mm-solo2-shock" aria-labelledby="solo-shock-title">
        <h2 id="solo-shock-title" className="mm-solo2-shock__title">
          A VERDADE INCÔMODA
        </h2>
        <div className="mm-solo2-shock__body">
          <p>
            Dá para fazer sozinho. Sem método, a chance de mexer no lugar errado, gastar energia à toa e
            continuar mal posicionado é alta.
          </p>
          <p>
            Muita gente não trava por falta de capacidade. Trava porque corrige o que aparece na tela e
            ignora o que pesa de verdade no julgamento do mercado.
          </p>
          <p>
            Sozinho, o padrão raro é falhar de uma vez. O padrão comum é perder meses ajustando mal o que
            já deveria estar resolvido.
          </p>
        </div>
      </section>

      <div className="mm-solo2-actions">
        <a className="mm-solo2-cta" href={MASTERFLOW_URL}>
          EU QUERO AJUDA
        </a>
        {onBack && (
          <button type="button" className="mm-solo2-cta-secondary" onClick={onBack}>
            MESMO ASSIM, QUERO TENTAR SOZINHO
          </button>
        )}
      </div>
    </div>
  );
}
