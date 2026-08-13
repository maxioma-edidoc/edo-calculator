/* Style: Динамичный B2B SaaS — фирменный акцент #ED6C0E, видимый прогресс, карточки-решения и ясный путь к результату. */
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { Building2, ChevronRight, ChevronLeft, Clock, FileText, Repeat2, ClipboardList, Clock3, TriangleAlert, Target, AlertCircle, CheckCircle2, Zap, type LucideIcon } from 'lucide-react';

interface Answer {
  companySize?: string;
  invoicesPerMonth?: string;
  workMethod?: string;
  paperProcess?: string[];
  timePerInvoice?: string;
  problems?: string[];
  priority?: string;
}

interface Results {
  monthlySavingsHours: number;
  annualSavingsHours: number;
  invoicesNotPrinted: number;
  readinessPct: number;
  readinessLevel: 'high' | 'medium' | 'low';
  recommendations: string[];
}

const questions = [
  {
    id: 'companySize',
    icon: Building2,
    title: 'Какая у вас компания?',
    description: 'Это нужно для расчета',
    type: 'radio',
    options: [
      { value: 'ip', label: 'ИП' },
      { value: 'small', label: 'До 10 сотрудников' },
      { value: 'medium', label: '10–50 сотрудников' },
      { value: 'large', label: 'Более 50 сотрудников' },
    ],
  },
  {
    id: 'invoicesPerMonth',
    icon: FileText,
    title: 'Сколько накладных оформляет ваша компания в месяц?',
    type: 'radio',
    options: [
      { value: 'low', label: 'До 20' },
      { value: 'medium', label: '20–50' },
      { value: 'high', label: '50–100' },
      { value: 'veryHigh', label: 'Более 100' },
    ],
  },
  {
    id: 'workMethod',
    icon: Repeat2,
    title: 'Как вы сейчас работаете с накладными?',
    type: 'radio',
    options: [
      { value: 'paperOnly', label: 'Только бумажные' },
      { value: 'mixed', label: 'И бумажные, и электронные' },
      { value: 'digitalOnly', label: 'Только электронные' },
    ],
  },
  {
    id: 'paperProcess',
    icon: ClipboardList,
    title: 'Что происходит с бумажной накладной после оформления?',
    description: 'Можно выбрать несколько вариантов',
    type: 'checkbox',
    options: [
      { value: 'print', label: 'Распечатываем' },
      { value: 'sign', label: 'Подписываем' },
      { value: 'stamp', label: 'Ставим печать' },
      { value: 'scan', label: 'Сканируем' },
      { value: 'send', label: 'Отправляем почтой/курьером' },
      { value: 'archive', label: 'Храним в архиве' },
    ],
  },
  {
    id: 'timePerInvoice',
    icon: Clock3,
    title: 'Сколько времени в среднем занимает оформление одной накладной?',
    type: 'radio',
    options: [
      { value: 'quick', label: 'До 5 минут' },
      { value: 'normal', label: '5–10 минут' },
      { value: 'slow', label: '10–20 минут' },
      { value: 'verySlow', label: 'Более 20 минут' },
    ],
  },
  {
    id: 'problems',
    icon: TriangleAlert,
    title: 'С какими ситуациями вы сталкивались за последний месяц?',
    description: 'Множественный выбор',
    type: 'checkbox',
    options: [
      { value: 'printerJam', label: 'Принтер зажевал документ' },
      { value: 'noPaper', label: 'Закончилась бумага' },
      { value: 'waitSignature', label: 'Ждали подпись руководителя' },
      { value: 'lostDoc', label: 'Потеряли документ' },
      { value: 'waitOriginal', label: 'Контрагент долго ждал оригинал' },
      { value: 'nothing', label: 'Ничего из этого' },
    ],
  },
  {
    id: 'priority',
    icon: Target,
    title: 'Что для вас важнее всего?',
    type: 'radio',
    options: [
      { value: 'time', label: 'Экономить время' },
      { value: 'cost', label: 'Сократить расходы' },
      { value: 'speed', label: 'Быстрее обмениваться документами' },
      { value: 'archive', label: 'Избавиться от бумажного архива' },
    ],
  },
];

export default function EDOCalculator() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Answer>({});
  const [results, setResults] = useState<Results | null>(null);

  // Для полностью электронного сценария бумажный блок не показывается вообще.
  const visibleQuestions = questions.filter((question) => {
    const isPaperOnlyQuestion = question.id === 'paperProcess';
    return !(isPaperOnlyQuestion && answers.workMethod === 'digitalOnly');
  });
  const currentQuestion = visibleQuestions[currentStep];
  const rawAnswer = answers[currentQuestion.id as keyof Answer];
  const isAnswered = Array.isArray(rawAnswer) ? rawAnswer.length > 0 : Boolean(rawAnswer);
  const progress = ((currentStep + 1) / visibleQuestions.length) * 100;
  const QuestionIcon = currentQuestion.icon as LucideIcon;
  const isAlreadyOnEDO = answers.workMethod === 'digitalOnly';

  const handleAnswer = (value: string) => {
    if (currentQuestion.type === 'radio') {
      setAnswers({ ...answers, [currentQuestion.id]: value });
    }
  };

  const handleCheckbox = (value: string) => {
    const current = (answers[currentQuestion.id as keyof Answer] as string[]) || [];
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    setAnswers({ ...answers, [currentQuestion.id]: updated });
  };

  const handleNext = () => {
    if (currentStep < visibleQuestions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      calculateResults();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const calculateResults = () => {
    // Базовые расчёты
    const invoiceMultipliers: Record<string, number> = {
      low: 10,
      medium: 35,
      high: 75,
      veryHigh: 150,
    };

    const timeMultipliers: Record<string, number> = {
      quick: 5,
      normal: 7.5,
      slow: 15,
      verySlow: 25,
    };

    const invoicesPerMonth = invoiceMultipliers[answers.invoicesPerMonth || 'medium'] || 35;
    const timePerInvoice = timeMultipliers[answers.timePerInvoice || 'normal'] || 7.5;

    // Прозрачный расчёт полного потенциала экономии.
    // Учитываем не только оформление, но и выбранные операции бумажного процесса.
    const selectedPaperProcess = (answers.paperProcess as string[]) || [];
    const processMinutesByStep: Record<string, number> = {
      print: 1.5,
      sign: 2,
      stamp: 0.5,
      scan: 2,
      send: 3,
      archive: 1.5,
    };
    const workflowMinutesPerInvoice = selectedPaperProcess.reduce(
      (total, step) => total + (processMinutesByStep[step] || 0),
      0,
    );
    const coordinationMinutesPerInvoice = selectedPaperProcess.length > 0 ? 0 : 5.5;
    const preparationMinutesPerInvoice = Math.min(timePerInvoice * 0.35, 8);
    const monthlySavingsMinutes = invoicesPerMonth * (
      preparationMinutesPerInvoice + workflowMinutesPerInvoice + coordinationMinutesPerInvoice
    );
    const monthlySavingsHours = Math.max(1, Math.round(monthlySavingsMinutes / 60));
    const annualSavingsHours = monthlySavingsHours * 12;

    // Документы, которые не будут напечатаны
    const invoicesNotPrinted = (answers.paperProcess as string[])?.includes('print')
      ? invoicesPerMonth
      : Math.round(invoicesPerMonth * 0.7);

    // Расчёт готовности к ЭДО
    let readinessPct = 50; // Базовая готовность

    // Добавляем баллы за ответы
    if (answers.workMethod === 'mixed') readinessPct += 15;
    if (answers.workMethod === 'digitalOnly') readinessPct += 30;
    if ((answers.paperProcess as string[])?.length >= 4) readinessPct += 10;
    if ((answers.problems as string[])?.length >= 3) readinessPct += 15;

    readinessPct = Math.min(readinessPct, 95);

    // Определяем уровень готовности
    let readinessLevel: 'high' | 'medium' | 'low' = 'low';
    if (readinessPct >= 80) readinessLevel = 'high';
    else if (readinessPct >= 60) readinessLevel = 'medium';

    // Рекомендации
    const recommendations: string[] = [];

    if (answers.workMethod === 'digitalOnly') {
      recommendations.push('Вы уже работаете в ЭДО — теперь главное понять, насколько понятна и удобна EDI-система вашего провайдера.');
      recommendations.push('Проверьте, насколько быстро сотрудники находят документы, подключают контрагентов и обрабатывают входящие.');
    }

    if (answers.workMethod === 'paperOnly') {
      recommendations.push('Начните с внедрения электронного документооборота для основных операций.');
    }
    if ((answers.problems as string[])?.includes('printerJam') || (answers.problems as string[])?.includes('noPaper')) {
      recommendations.push('Проблемы с печатью — это сигнал к переходу на ЭДО.');
    }
    if ((answers.problems as string[])?.includes('lostDoc')) {
      recommendations.push('Электронный архив предотвратит потерю документов.');
    }
    if ((answers.problems as string[])?.includes('waitOriginal')) {
      recommendations.push('ЭДО позволит обмениваться документами мгновенно.');
    }
    if (answers.priority === 'time' && !isAlreadyOnEDO) {
      recommendations.push('Экономия времени — главное преимущество ЭДО для вашей компании.');
    }
    if (answers.priority === 'cost') {
      recommendations.push('ЭДО снизит расходы на печать, доставку и хранение.');
    }

    if (recommendations.length === 0) {
      recommendations.push('Ваша компания готова к переходу на электронные накладные.');
    }

    setResults({
      monthlySavingsHours: isAlreadyOnEDO ? 0 : monthlySavingsHours,
      annualSavingsHours: isAlreadyOnEDO ? 0 : annualSavingsHours,
      invoicesNotPrinted: isAlreadyOnEDO ? 0 : invoicesNotPrinted,
      readinessPct: isAlreadyOnEDO ? 100 : readinessPct,
      readinessLevel: isAlreadyOnEDO ? 'high' : readinessLevel,
      recommendations,
    });
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setAnswers({});
    setResults(null);
  };

  if (results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFF6EF] to-white py-12 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Заголовок результатов */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Готово!</h1>
            <p className="text-gray-600">По вашим ответам:</p>
          </div>

          {/* Карточки результатов */}
          {isAlreadyOnEDO ? (
            <Card className="mb-8 overflow-hidden border-0 bg-slate-900 p-7 text-white shadow-xl shadow-slate-900/10">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#ED6C0E] text-white">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#F5A56D]">Вы уже на ЭДО</p>
                  <h2 className="font-display mb-3 text-2xl font-bold">Теперь главное — удобство вашей EDI-системы</h2>
                  <p className="text-sm leading-6 text-slate-300">Проверьте, насколько понятен интерфейс провайдера, быстро ли подключаются контрагенты и удобно ли обрабатывать входящие документы.</p>
                </div>
              </div>

            </Card>
          ) : null}
          {!isAlreadyOnEDO && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {/* Экономия времени */}
            <Card className="p-6 border-0 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-[#FBE3D1]">
                    <Clock className="w-6 h-6 text-[#ED6C0E]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Потенциальная экономия</p>
                    <p className="text-3xl font-bold text-gray-900">{isAlreadyOnEDO ? '—' : results.monthlySavingsHours}</p>
                    <p className="text-xs text-gray-500">{isAlreadyOnEDO ? 'уже работаете в ЭДО' : `часов в месяц · ${results.annualSavingsHours} ч/год`}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Документы */}
            <Card className="p-6 border-0 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-blue-100">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Не будет напечатано</p>
                    <p className="text-3xl font-bold text-gray-900">{isAlreadyOnEDO ? '—' : results.invoicesNotPrinted}</p>
                    <p className="text-xs text-gray-500">{isAlreadyOnEDO ? 'бумажный процесс не используется' : 'документов в месяц'}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Готовность к ЭДО */}
            <Card className="p-6 border-0 shadow-lg hover:shadow-xl transition-shadow md:col-span-2">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Уровень готовности к ЭДО</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-4xl font-bold text-gray-900">{results.readinessPct}%</p>
                    <div className="flex items-center gap-2">
                      {results.readinessLevel === 'high' && (
                        <>
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                          <span className="text-sm font-semibold text-green-600">Готова</span>
                        </>
                      )}
                      {results.readinessLevel === 'medium' && (
                        <>
                          <AlertCircle className="w-5 h-5 text-yellow-600" />
                          <span className="text-sm font-semibold text-yellow-600">Переходный период</span>
                        </>
                      )}
                      {results.readinessLevel === 'low' && (
                        <>
                          <AlertCircle className="w-5 h-5 text-red-600" />
                          <span className="text-sm font-semibold text-red-600">Нужна подготовка</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <Progress value={results.readinessPct} className="h-2" />
            </Card>
          </div>
          )}

          {!isAlreadyOnEDO && (
            <p className="mb-8 text-center text-xs leading-5 text-gray-500">
              Оценка учитывает время на оформление накладной и выбранные операции с бумагой: печать, подпись, сканирование, отправку и архивирование. Это ориентир для оценки потенциала, а не гарантированный результат.
            </p>
          )}

          {/* Рекомендации */}
          <Card className="p-6 border-0 shadow-lg mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-[#ED6C0E]" />
              <h3 className="text-lg font-semibold text-gray-900">Рекомендации</h3>
            </div>
            <ul className="space-y-3">
              {results.recommendations.map((rec, idx) => (
                <li key={idx} className="flex gap-3 text-sm text-gray-700">
                  <span className="text-[#ED6C0E] font-bold">✓</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Персональный мост к действию (связка расчета с переходом в EDIDOC) */}
          <Card className="mb-8 border-0 bg-[#FFF6EF] p-6 shadow-lg shadow-[#FBE3D1]/60">
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#ED6C0E] mb-1">Следующий шаг для вашей компании</p>
                <h3 className="font-display text-lg font-bold text-gray-900">
                  {isAlreadyOnEDO
                    ? 'Оцените удобство и скорость вашей EDI-системы'
                    : answers.workMethod === 'mixed'
                    ? 'Переведите оставшиеся бумажные документы в электронный вид'
                    : 'Избавьтесь от рутины с бумажными накладными'}
                </h3>
                <p className="mt-2 text-sm leading-6 text-gray-700">
                  {isAlreadyOnEDO
                    ? 'Вы уже работаете с электронными документами. Убедитесь, что ваш провайдер не берёт плату за входящие и подключает партнёров за пару кликов.'
                    : `Каждый месяц вы теряете около ${results.monthlySavingsHours} часов на бумажных операциях. EDIDOC устраняет эти затраты за счёт прямой интеграции и бесплатного приёма документов.`}
                </p>
              </div>

              <div className="pt-2 border-t border-[#FBE3D1] flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-gray-900 text-sm">EDIDOC — аттестованный EDI-провайдер Беларуси</p>
                  <p className="text-xs text-gray-600">Регистрация в 2 клика, все входящие бесплатны — без тарификации и абон. платы.</p>
                </div>
                <a
                  href="https://edidoc.by/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-12 shrink-0 items-center justify-center rounded-xl bg-[#ED6C0E] px-6 text-sm font-semibold text-white shadow-md shadow-[#ED6C0E]/20 transition hover:bg-[#C85A0B]"
                >
                  {isAlreadyOnEDO ? 'Проверить EDIDOC' : answers.workMethod === 'mixed' ? 'Ускорить обмен в EDIDOC' : 'Начать работу в EDIDOC'}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </a>
              </div>
            </div>
          </Card>

          {/* Единственное действие после результата */}
          <div className="flex">
            <Button
              onClick={handleRestart}
              variant="outline"
              className="w-full h-12 border-[#ED6C0E] bg-transparent text-black hover:border-[#C85A0B] hover:bg-transparent hover:text-black focus-visible:ring-[#ED6C0E]"
            >
              Начать заново
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF6EF] to-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Логотип */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#ED6C0E] shadow-lg shadow-[#ED6C0E]/20 mb-4 overflow-hidden">
            <img src={`${import.meta.env.BASE_URL}edo_logo.png`} alt="ЭДО" className="w-10 h-10 object-contain" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#ED6C0E] mb-2">Путь к эффективности</p>
          <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">Калькулятор ЭДО</h1>
          <p className="text-gray-600">За 2 минуты узнайте, сколько времени сможет сэкономить ваша компания</p>
        </div>

        {/* Прогресс-бар — фирменная rail-метафора движения к результату */}
        <div className="mb-8 rounded-2xl border border-[#FBE3D1] bg-white/80 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Ваш расчёт</p>
              <p className="font-display text-sm font-semibold text-gray-900">Шаг {currentStep + 1} из {questions.length}</p>
            </div>
            <div className="text-right">
              <p className="font-display text-xl font-bold text-[#ED6C0E]">{Math.round(progress)}%</p>
              <p className="text-xs text-gray-500">до результата</p>
            </div>
          </div>
          <div className="relative mb-3">
            <Progress value={progress} className="h-3 bg-[#FBE3D1] [&>div]:bg-[#ED6C0E]" />
          </div>
          <div className="grid grid-cols-7 gap-1">
              {visibleQuestions.map((question, index) => {
              const isComplete = index < currentStep;
              const isCurrent = index === currentStep;
              return (
                <div key={question.id} className="flex flex-col items-center gap-1">
                  <div className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold transition-colors ${isComplete ? 'bg-emerald-500 text-white' : isCurrent ? 'bg-[#ED6C0E] text-white ring-4 ring-[#FBE3D1]' : 'bg-[#FBE3D1] text-[#C85A0B]'}`}>
                    {isComplete ? '✓' : index + 1}
                  </div>
                  <span className={`hidden text-[9px] font-medium sm:block ${isCurrent ? 'text-[#C85A0B]' : 'text-gray-400'}`}>{index === currentStep ? 'сейчас' : isComplete ? 'готово' : 'дальше'}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Карточка вопроса */}
        <Card className="p-8 border-0 shadow-lg mb-8">
          <div className="mb-6">
            <div className="mb-4 flex items-start gap-4">
              <div className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FBE3D1] text-[#ED6C0E]">
                <QuestionIcon className="h-5 w-5" />
              </div>
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#ED6C0E]">Уточним детали</p>
                <h2 className="font-display text-2xl font-bold leading-tight text-gray-900">{currentQuestion.title}</h2>
              </div>
            </div>
            {currentQuestion.description && (
              <p className="ml-15 text-sm text-gray-600">{currentQuestion.description}</p>
            )}
          </div>

          {/* Варианты ответов */}
          <div className="space-y-3 mb-8">
            {currentQuestion.type === 'radio' && (
              <RadioGroup value={answers[currentQuestion.id as keyof Answer] as string || ''} onValueChange={handleAnswer}>
                {currentQuestion.options?.map((option, optionIndex) => {
                  const selected = answers[currentQuestion.id as keyof Answer] === option.value;
                  return (
                    <div key={option.value} className={`group flex items-center gap-3 rounded-2xl border p-4 transition-all duration-200 ${selected ? 'border-[#ED6C0E] bg-[#FFF6EF] shadow-sm shadow-[#FBE3D1]' : 'border-gray-100 bg-gray-50/70 hover:-translate-y-0.5 hover:border-[#F7C2A0] hover:bg-white hover:shadow-md'}`}>
                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${selected ? 'bg-[#ED6C0E] text-white' : 'bg-white text-gray-400 shadow-sm'}`}>{String(optionIndex + 1).padStart(2, '0')}</div>
                      <RadioGroupItem value={option.value} id={option.value} className="shrink-0" />
                      <Label htmlFor={option.value} className="flex-1 cursor-pointer font-medium text-gray-800">{option.label}</Label>
                      <ChevronRight className={`h-4 w-4 transition-transform ${selected ? 'translate-x-0.5 text-[#ED6C0E]' : 'text-gray-300 group-hover:translate-x-0.5 group-hover:text-[#F19250]'}`} />
                    </div>
                  );
                })}
              </RadioGroup>
            )}

            {currentQuestion.type === 'checkbox' && (
              <div className="space-y-3">
                {currentQuestion.options?.map((option, optionIndex) => {
                  const selected = (answers[currentQuestion.id as keyof Answer] as string[])?.includes(option.value) || false;
                  return (
                    <div key={option.value} className={`group flex items-center gap-3 rounded-2xl border p-4 transition-all duration-200 ${selected ? 'border-blue-500 bg-blue-50 shadow-sm shadow-blue-100' : 'border-gray-100 bg-gray-50/70 hover:-translate-y-0.5 hover:border-blue-200 hover:bg-white hover:shadow-md'}`}>
                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${selected ? 'bg-blue-600 text-white' : 'bg-white text-gray-400 shadow-sm'}`}>{String(optionIndex + 1).padStart(2, '0')}</div>
                      <Checkbox
                        id={option.value}
                        checked={selected}
                        onCheckedChange={() => handleCheckbox(option.value)}
                        className="shrink-0"
                      />
                      <Label htmlFor={option.value} className="flex-1 cursor-pointer font-medium text-gray-800">{option.label}</Label>
                      <CheckCircle2 className={`h-4 w-4 transition-colors ${selected ? 'text-blue-600' : 'text-gray-200 group-hover:text-blue-300'}`} />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Кнопки навигации */}
          <div className="flex gap-4">
            <Button
              onClick={handlePrev}
              variant="outline"
              disabled={currentStep === 0}
              className="flex-1 h-12"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Назад
            </Button>
            <Button
              onClick={handleNext}
              disabled={!isAnswered}
              className="flex-1 h-12 bg-[#ED6C0E] hover:bg-[#C85A0B] disabled:opacity-50"
            >
              {currentStep === visibleQuestions.length - 1 ? 'Получить результаты' : 'Далее'}
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </Card>

        {/* Подвал */}
          <p className="text-center text-sm text-gray-500">
          Ответьте на этот вопрос — и расчёт станет точнее. Следующий шаг уже рядом.
        </p>
      </div>
    </div>
  );
}
