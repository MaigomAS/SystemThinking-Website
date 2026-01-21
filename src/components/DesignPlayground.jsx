import Button from './ui/Button.jsx';
import Card from './ui/Card.jsx';
import Chip from './ui/Chip.jsx';
import Container from './ui/Container.jsx';
import Section from './ui/Section.jsx';

const colorTokens = [
  { name: 'Background', value: 'var(--color-bg)' },
  { name: 'Surface', value: 'var(--color-surface)' },
  { name: 'Surface 2', value: 'var(--color-surface-2)' },
  { name: 'Brand 1', value: 'var(--color-brand-1)' },
  { name: 'Brand 2', value: 'var(--color-brand-2)' },
  { name: 'Brand 3', value: 'var(--color-brand-3)' },
  { name: 'Brand 4', value: 'var(--color-brand-4)' },
  { name: 'Text Primary', value: 'var(--color-text-primary)' },
];

const radiusTokens = [
  { name: 'XS', value: 'var(--radius-xs)' },
  { name: 'SM', value: 'var(--radius-sm)' },
  { name: 'MD', value: 'var(--radius-md)' },
  { name: 'LG', value: 'var(--radius-lg)' },
  { name: 'XL', value: 'var(--radius-xl)' },
  { name: 'Pill', value: 'var(--radius-pill)' },
];

const shadowTokens = [
  { name: 'XS', value: 'var(--shadow-xs)' },
  { name: 'SM', value: 'var(--shadow-sm)' },
  { name: 'MD', value: 'var(--shadow-md)' },
  { name: 'LG', value: 'var(--shadow-lg)' },
];

function DesignPlayground() {
  return (
    <div className="playground">
      <Container>
        <header className="ui-section__header">
          <span className="ui-section__eyebrow">Design System</span>
          <h2>Playground · Tokens y Componentes</h2>
          <p>
            Una vista rápida para validar paleta, tipografía y componentes base. Edita tokens en{' '}
            <code>src/styles/tokens.css</code>.
          </p>
        </header>
      </Container>

      <Section tone="mid" title="Paleta & Tokens">
        <div className="token-grid">
          {colorTokens.map((token) => (
            <div key={token.name} className="token-card">
              <div className="token-swatch" style={{ background: token.value }} />
              <strong>{token.name}</strong>
              <span>{token.value}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="dark" title="Tipografía">
        <div className="typography-stack">
          <div>
            <span>Display / H1</span>
            <h1 style={{ fontSize: 'var(--font-size-4xl)', lineHeight: 'var(--line-height-tight)' }}>
              Systemic Strategy & Leadership
            </h1>
          </div>
          <div>
            <span>Heading / H2</span>
            <h2 style={{ fontSize: 'var(--font-size-3xl)', lineHeight: 'var(--line-height-tight)' }}>
              Ecosistemas colaborativos con impacto real
            </h2>
          </div>
          <div>
            <span>Body</span>
            <p style={{ maxWidth: '520px', color: 'var(--color-text-secondary)' }}>
              Diseñamos experiencias premium para líderes que necesitan claridad estratégica, rigor y ejecución en
              entornos complejos.
            </p>
          </div>
        </div>
      </Section>

      <Section tone="mid" title="Componentes base">
        <div className="section-grid">
          <div className="card-grid">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="dark">Dark</Button>
            <Button variant="primary" disabled>
              Disabled
            </Button>
          </div>
          <div className="card-grid">
            <Chip>Soft Chip</Chip>
            <Chip variant="solid">Solid Chip</Chip>
            <Chip variant="outline">Outline Chip</Chip>
          </div>
          <div className="card-grid">
            <Card variant="glass" as="article">
              <h4>Glass Card</h4>
              <p>Para superficies flotantes con blur sutil y bordes premium.</p>
            </Card>
            <Card variant="outline" as="article">
              <h4>Outline Card</h4>
              <p>Útil para layouts oscuros con jerarquía suave.</p>
            </Card>
            <Card variant="elevated" as="article">
              <h4>Elevated Card</h4>
              <p>Superficie clara con sombra suave y padding generoso.</p>
            </Card>
          </div>
        </div>
      </Section>

      <Section tone="light" title="Radii & Sombras">
        <div className="split">
          <Card variant="elevated" className="section-grid">
            <h4>Radii</h4>
            <div className="card-grid">
              {radiusTokens.map((token) => (
                <div key={token.name} className="token-card" style={{ borderRadius: token.value }}>
                  <strong>{token.name}</strong>
                  <span>{token.value}</span>
                </div>
              ))}
            </div>
          </Card>
          <Card variant="elevated" className="section-grid">
            <h4>Sombras</h4>
            <div className="card-grid">
              {shadowTokens.map((token) => (
                <div key={token.name} className="token-card" style={{ boxShadow: token.value }}>
                  <strong>{token.name}</strong>
                  <span>{token.value}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </Section>
    </div>
  );
}

export default DesignPlayground;
