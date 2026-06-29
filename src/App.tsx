import { useState } from 'react';
import { 
  Calculator, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  BookOpen, 
  ListCheck, 
  ArrowRight, 
  Sparkles,
  RefreshCw,
  Cpu,
  CreditCard
} from 'lucide-react';
import { 
  calculateLuhnCheckDigit, 
  validateLuhnNumber
} from './utils/luhn';
import type {
  LuhnCalculationResult, 
  LuhnValidationResult 
} from './utils/luhn';
import './App.css';

// Parte III Preset Data
const PART_3_CALCS = [
  { input: '3247-4935-8587-883', checkDigit: 2, full: '3247-4935-8587-8832' },
  { input: '8985-6319-4884-265', checkDigit: 7, full: '8985-6319-4884-2657' },
  { input: '6656-7674-9731-285', checkDigit: 8, full: '6656-7674-9731-2858' },
  { input: '29-967-14', checkDigit: 8, full: '29-967-148' },
  { input: '64-788-46', checkDigit: 6, full: '64-788-466' },
  { input: '6945-9273-832-414-3858-734-71', checkDigit: 4, full: '6945-9273-832-414-3858-734-714' }
];

const PART_3_VALS = [
  { input: '5262-3656-4154-29262', isValid: true, sum: 70, expectedCheck: 2 },
  { input: '6857-9539-8377-36527', isValid: false, sum: 93, expectedCheck: 4 },
  { input: '5975-5954-9975-19711', isValid: false, sum: 95, expectedCheck: 6 },
  { input: '91-523-9855', isValid: false, sum: 46, expectedCheck: 9 },
  { input: '59-425-2722', isValid: false, sum: 44, expectedCheck: 8 },
  { input: '7351-7325-627-553-3668-221-3422', isValid: false, sum: 107, expectedCheck: 5 }
];

function App() {
  const [activeTab, setActiveTab] = useState<'calc' | 'val' | 'part3' | 'theory'>('calc');
  
  // Calculator State
  const [calcInput, setCalcInput] = useState<string>('7992739871');
  const [calcResult, setCalcResult] = useState<LuhnCalculationResult>(() => calculateLuhnCheckDigit('7992739871'));

  // Validator State
  const [valInput, setValInput] = useState<string>('5262-3656-4154-29262');
  const [valResult, setValResult] = useState<LuhnValidationResult>(() => validateLuhnNumber('5262-3656-4154-29262'));

  const handleCalculate = (strToCalc?: string) => {
    const target = strToCalc !== undefined ? strToCalc : calcInput;
    setCalcResult(calculateLuhnCheckDigit(target));
  };

  const handleValidate = (strToVal?: string) => {
    const target = strToVal !== undefined ? strToVal : valInput;
    setValResult(validateLuhnNumber(target));
  };

  const loadCalcPreset = (num: string) => {
    setCalcInput(num);
    handleCalculate(num);
    setActiveTab('calc');
  };

  const loadValPreset = (num: string) => {
    setValInput(num);
    handleValidate(num);
    setActiveTab('val');
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="brand-badge">
          <Cpu size={16} /> Hans Peter Luhn Algorithm (IBM)
        </div>
        <h1 className="app-title">Algoritmo de Luhn (Módulo 10)</h1>
        <p className="app-subtitle">
          Fórmula de suma de comprobación simple para la validación de tarjetas de crédito, números IMEI y datos bancarios confidenciales.
        </p>
        <div className="tech-tags">
          <span className="tag">ISO/IEC 7812-1</span>
          <span className="tag">Verificación Módulo 10</span>
          <span className="tag">Dígito de Chequeo</span>
          <span className="tag">Seguridad de Datos</span>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="nav-tabs">
        <button 
          className={`tab-btn ${activeTab === 'calc' ? 'active' : ''}`}
          onClick={() => setActiveTab('calc')}
        >
          <Calculator size={18} /> Parte I & II: Calcu. Dígito
        </button>
        <button 
          className={`tab-btn ${activeTab === 'val' ? 'active' : ''}`}
          onClick={() => setActiveTab('val')}
        >
          <ShieldCheck size={18} /> Parte I & II: Validador
        </button>
        <button 
          className={`tab-btn ${activeTab === 'part3' ? 'active' : ''}`}
          onClick={() => setActiveTab('part3')}
        >
          <ListCheck size={18} /> Parte III: Ejercicios
        </button>
        <button 
          className={`tab-btn ${activeTab === 'theory' ? 'active' : ''}`}
          onClick={() => setActiveTab('theory')}
        >
          <BookOpen size={18} /> Explicación Teórica
        </button>
      </nav>

      {/* TAB 1: CALCULATOR */}
      {activeTab === 'calc' && (
        <section className="card-panel">
          <div className="card-title">
            <Calculator className="text-purple-400" size={24} />
            Cálculo del Dígito Verificador (Dígito de Chequeo)
          </div>
          <p className="card-desc">
            Ingresa un número de cuenta o serie parcial. El algoritmo duplicará cada segundo dígito comenzando desde la derecha y calculará el dígito verificador.
          </p>

          <div className="input-group">
            <label className="input-label">Número de Cuenta / Tarjeta Parcial:</label>
            <div className="input-wrapper">
              <input 
                type="text" 
                className="custom-input" 
                value={calcInput}
                onChange={(e) => {
                  setCalcInput(e.target.value);
                  handleCalculate(e.target.value);
                }}
                placeholder="Ej. 7992739871"
              />
              <button className="action-btn" onClick={() => handleCalculate()}>
                <RefreshCw size={18} /> Calcular
              </button>
            </div>
            <div className="preset-bar">
              <span className="preset-title">Ejemplos rápidos:</span>
              <button className="preset-chip" onClick={() => loadCalcPreset('7992739871')}>7992739871 (Ej. Guía)</button>
              <button className="preset-chip" onClick={() => loadCalcPreset('3247-4935-8587-883')}>3247-4935-8587-883</button>
              <button className="preset-chip" onClick={() => loadCalcPreset('6945-9273-832-414-3858-734-71')}>6945... (Largo)</button>
            </div>
          </div>

          {calcResult.cleanedInput.length > 0 ? (
            <div className="results-container">
              <h3 style={{ marginBottom: '1rem', color: '#fff', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={18} color="#c084fc" /> Procedimiento Paso a Paso (Tabla Módulo 10)
              </h3>

              <div className="table-wrapper">
                <table className="luhn-table">
                  <thead>
                    <tr>
                      <th className="header-col">Operación</th>
                      {calcResult.steps.map((_, idx) => (
                        <th key={idx}>D{idx + 1}</th>
                      ))}
                      <th className="cell-check">x</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="header-col">Dígitos del número</td>
                      {calcResult.steps.map((s, idx) => (
                        <td key={idx} className="cell-digit">{s.digit}</td>
                      ))}
                      <td className="cell-check">x</td>
                    </tr>
                    <tr>
                      <td className="header-col">Duplicar dígitos pares (←)</td>
                      {calcResult.steps.map((s, idx) => (
                        <td key={idx} className={`cell-doubled ${s.isDoubled ? 'highlight' : ''}`}>
                          {s.doubledValue}
                        </td>
                      ))}
                      <td className="cell-check">x</td>
                    </tr>
                    <tr>
                      <td className="header-col">Sumar dígitos reducidos</td>
                      {calcResult.steps.map((s, idx) => (
                        <td key={idx} className="cell-sum">{s.sumExpression}</td>
                      ))}
                      <td className="cell-check">= {calcResult.totalSum}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="math-grid">
                <div className="math-card">
                  <div className="math-card-header">Suma Total de Dígitos (S)</div>
                  <div className="math-expression">S = {calcResult.totalSum}</div>
                  <div className="math-result">Suma: {calcResult.totalSum}</div>
                </div>

                <div className="math-card">
                  <div className="math-card-header">Método 1: Multiplicación por 9</div>
                  <div className="math-expression">({calcResult.totalSum} × 9) mod 10</div>
                  <div className="math-expression">({calcResult.totalSum * 9}) mod 10 = {calcResult.method1Result}</div>
                  <div className="math-result">Dígito = {calcResult.method1Result}</div>
                </div>

                <div className="math-card">
                  <div className="math-card-header">Método 2: Resta del Módulo 10</div>
                  <div className="math-expression">Unidades = {calcResult.unitDigit}</div>
                  <div className="math-expression">(10 - {calcResult.unitDigit}) mod 10</div>
                  <div className="math-result">Dígito = {calcResult.method2Result}</div>
                </div>
              </div>

              <div className="banner-box info">
                <div className="banner-left">
                  <div className="banner-icon">
                    <CreditCard size={28} />
                  </div>
                  <div>
                    <div className="banner-title">Dígito Verificador Calculado: {calcResult.checkDigit}</div>
                    <div className="banner-subtitle">
                      Número de cuenta completo generado: <strong className="mono" style={{ color: '#fbbf24' }}>{calcResult.fullNumber}</strong>
                    </div>
                  </div>
                </div>
                <div className="big-badge">{calcResult.checkDigit}</div>
              </div>
            </div>
          ) : (
            <p style={{ color: 'var(--text-dim)' }}>Por favor ingresa un número numérico válido.</p>
          )}
        </section>
      )}

      {/* TAB 2: VALIDATOR */}
      {activeTab === 'val' && (
        <section className="card-panel">
          <div className="card-title">
            <ShieldCheck className="text-emerald-400" size={24} />
            Validación de Número Completo con Dígito de Chequeo
          </div>
          <p className="card-desc">
            Ingresa un número completo (incluyendo el último dígito verificador). El algoritmo validará si la suma total módulo 10 es exactamente 0.
          </p>

          <div className="input-group">
            <label className="input-label">Número Completo a Validar:</label>
            <div className="input-wrapper">
              <input 
                type="text" 
                className="custom-input" 
                value={valInput}
                onChange={(e) => {
                  setValInput(e.target.value);
                  handleValidate(e.target.value);
                }}
                placeholder="Ej. 5262-3656-4154-29262"
              />
              <button className="action-btn" style={{ background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' }} onClick={() => handleValidate()}>
                <ShieldCheck size={18} /> Validar Número
              </button>
            </div>
            <div className="preset-bar">
              <span className="preset-title">Cargar de Parte III:</span>
              <button className="preset-chip" onClick={() => loadValPreset('5262-3656-4154-29262')}>5262... (Válido)</button>
              <button className="preset-chip" onClick={() => loadValPreset('6857-9539-8377-36527')}>6857... (Inválido)</button>
              <button className="preset-chip" onClick={() => loadValPreset('7351-7325-627-553-3668-221-3422')}>7351... (Inválido)</button>
            </div>
          </div>

          {valResult.cleanedInput.length > 0 ? (
            <div className="results-container">
              <h3 style={{ marginBottom: '1rem', color: '#fff', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={18} color="#34d399" /> Verificación del Algoritmo Completo
              </h3>

              <div className="table-wrapper">
                <table className="luhn-table">
                  <thead>
                    <tr>
                      <th className="header-col">Posición</th>
                      {valResult.steps.map((_, idx) => (
                        <th key={idx} className={idx === valResult.steps.length - 1 ? 'cell-check' : ''}>
                          {idx === valResult.steps.length - 1 ? 'Check (x)' : `D${idx + 1}`}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="header-col">Dígito ingresado</td>
                      {valResult.steps.map((s, idx) => (
                        <td key={idx} className={`cell-digit ${idx === valResult.steps.length - 1 ? 'cell-check' : ''}`}>{s.digit}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="header-col">Duplicación (←)</td>
                      {valResult.steps.map((s, idx) => (
                        <td key={idx} className={`cell-doubled ${s.isDoubled ? 'highlight' : ''} ${idx === valResult.steps.length - 1 ? 'cell-check' : ''}`}>
                          {s.doubledValue}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="header-col">Suma individual</td>
                      {valResult.steps.map((s, idx) => (
                        <td key={idx} className={`cell-sum ${idx === valResult.steps.length - 1 ? 'cell-check' : ''}`}>{s.sumExpression}</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="math-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                <div className="math-card">
                  <div className="math-card-header">Suma Total Incluyendo Dígito Verificador</div>
                  <div className="math-expression">Suma Total = {valResult.totalSum}</div>
                  <div className="math-expression">{valResult.totalSum} mod 10 = {valResult.totalSum % 10}</div>
                </div>

                <div className="math-card">
                  <div className="math-card-header">Comparación de Dígitos de Control</div>
                  <div className="math-expression">Dígito en el número: {valResult.providedCheckDigit}</div>
                  <div className="math-expression">Dígito esperado (calculado): {valResult.calculatedCheckDigit}</div>
                </div>
              </div>

              {valResult.isValid ? (
                <div className="banner-box success">
                  <div className="banner-left">
                    <div className="banner-icon">
                      <CheckCircle2 size={32} />
                    </div>
                    <div>
                      <div className="banner-title">¡Número VÁLIDO según el Algoritmo de Luhn!</div>
                      <div className="banner-subtitle">La suma total de los dígitos es {valResult.totalSum}, cuyo módulo 10 es exactamente 0.</div>
                    </div>
                  </div>
                  <div className="big-badge">VÁLIDO</div>
                </div>
              ) : (
                <div className="banner-box error">
                  <div className="banner-left">
                    <div className="banner-icon">
                      <XCircle size={32} />
                    </div>
                    <div>
                      <div className="banner-title">Número INCORRECTO / INVÁLIDO</div>
                      <div className="banner-subtitle">
                        La suma total es {valResult.totalSum} (módulo 10 = {valResult.totalSum % 10}). Contiene el dígito verificador <strong style={{color:'#fff'}}>{valResult.providedCheckDigit}</strong> pero el correcto debería ser <strong style={{color:'#fef08a'}}>{valResult.calculatedCheckDigit}</strong>.
                      </div>
                    </div>
                  </div>
                  <div className="big-badge">INVÁLIDO</div>
                </div>
              )}
            </div>
          ) : (
            <p style={{ color: 'var(--text-dim)' }}>Ingresa un número para comenzar la verificación.</p>
          )}
        </section>
      )}

      {/* TAB 3: PARTE III */}
      {activeTab === 'part3' && (
        <section className="card-panel">
          <div className="card-title">
            <ListCheck className="text-amber-400" size={24} />
            Resolución de Ejercicios - Parte III
          </div>
          <p className="card-desc">
            Resultados completos y verificaciones automáticas para todos los ejercicios solicitados en la Parte III de la práctica. Haz clic en el botón "Ver paso a paso" para probar cualquiera en el calculador o validador interactivo.
          </p>

          <div className="part3-grid">
            {/* Subsection 1 */}
            <div>
              <h3 style={{ color: '#a5b4fc', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Calculator size={18} /> 1. Cálculo del Dígito Verificador (x)
              </h3>
              {PART_3_CALCS.map((item, idx) => (
                <div className="exercise-card" key={idx}>
                  <div>
                    <div className="ex-num">{item.input}?</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      Completo: <span className="mono" style={{ color: '#34d399' }}>{item.full}</span>
                    </div>
                  </div>
                  <div className="ex-result">
                    <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fbbf24' }} className="mono">
                      x = {item.checkDigit}
                    </span>
                    <button className="mini-btn" onClick={() => loadCalcPreset(item.input)}>
                      Paso a paso <ArrowRight size={14} style={{ inlineSize: '1em' }} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Subsection 2 */}
            <div>
              <h3 style={{ color: '#a5b4fc', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={18} /> 2. Verificación de Números de Tarjeta
              </h3>
              {PART_3_VALS.map((item, idx) => (
                <div className="exercise-card" key={idx}>
                  <div>
                    <div className="ex-num" style={{ fontSize: '0.95rem' }}>{item.input}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      Suma: {item.sum} {item.isValid ? '(Mod 10 = 0)' : `(Esperado x=${item.expectedCheck})`}
                    </div>
                  </div>
                  <div className="ex-result">
                    {item.isValid ? (
                      <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', padding: '0.2rem 0.6rem', borderRadius: '6px', fontWeight: 700, fontSize: '0.85rem' }}>
                        Correcto
                      </span>
                    ) : (
                      <span style={{ background: 'rgba(244, 63, 94, 0.2)', color: '#fb7185', padding: '0.2rem 0.6rem', borderRadius: '6px', fontWeight: 700, fontSize: '0.85rem' }}>
                        Incorrecto
                      </span>
                    )}
                    <button className="mini-btn" onClick={() => loadValPreset(item.input)}>
                      Validar <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TAB 4: THEORY */}
      {activeTab === 'theory' && (
        <section className="card-panel">
          <div className="card-title">
            <BookOpen className="text-cyan-400" size={24} />
            ¿Qué es el algoritmo de Luhn y cómo funciona?
          </div>
          <div className="theory-content">
            <p>
              El <strong>algoritmo de Luhn</strong>, también conocido como «fórmula de Luhn», «módulo 10» o algoritmo «mod 10», es una fórmula de suma de comprobación simple que se utiliza para validar números de identificación. Fue desarrollado por el ingeniero de IBM <strong>Hans Peter Luhn</strong> y patentado en 1954.
            </p>
            <p>
              Se utiliza ampliamente en la verificación de tarjetas de crédito (Visa, Mastercard, American Express), números IMEI de teléfonos móviles, números de cuentas bancarias y códigos de barras. Su propósito principal es proteger contra errores accidentales de transcripción o entrada de datos.
            </p>

            <h3>Fórmula y Algoritmo Paso a Paso</h3>
            <ul>
              <li><strong>Paso 1: Duplicación alternada.</strong> Comenzando desde el dígito inmediatamente a la izquierda del dígito verificador (o desde el último dígito si se valida un número completo), ir de derecha a izquierda duplicando el valor de cada segundo dígito.</li>
              <li><strong>Paso 2: Reducción de dígitos.</strong> Si la duplicación de un dígito resulta en un número mayor o igual a 10 (por ejemplo, $8 \times 2 = 16$), se suman los dígitos del resultado ($1 + 6 = 7$) o equivalentemente se le restan 9.</li>
              <li><strong>Paso 3: Suma total.</strong> Se suman todos los dígitos reducidos junto con los dígitos que no fueron duplicados del número original.</li>
              <li><strong>Paso 4: Comprobación.</strong> Si el total obtenido es múltiplo de 10 (es decir, $Total \pmod{10} = 0$), el número es válido según la fórmula de Luhn. De lo contrario, no es válido.</li>
            </ul>

            <h3>Métodos para obtener el Dígito Verificador ($x$)</h3>
            <p>Dada una suma parcial de los dígitos reducidos $S$:</p>
            <ul>
              <li><strong>Método 1 (Multiplicación por 9):</strong> $x = (S \times 9) \pmod{10}$.</li>
              <li><strong>Método 2 (Resta de Módulo):</strong> Se toman las unidades de $S$ (es decir, $U = S \pmod{10}$). El dígito de chequeo es $(10 - U) \pmod{10}$.</li>
            </ul>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="app-footer">
        Desarrollado con React + TypeScript + Vite &bull; Algoritmo de Luhn Módulo 10 &bull; 2026
      </footer>
    </div>
  );
}

export default App;
