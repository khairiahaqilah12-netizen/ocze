import React, { useMemo, useState } from 'react';
import { BookOpen, Calendar, Check, Droplets, NotebookPen, Plus, Trash2 } from 'lucide-react';
import { TopHeader } from '../../components/layout/TopHeader';
import { PRODUCTS } from '../../data/products';
import { useApp } from '../../context/AppContext';
import { SkinComfortLevel } from '../../types';

const COMFORT_OPTIONS: SkinComfortLevel[] = [
  'Calm',
  'Mild Dryness',
  'Itchy / Flare-Up',
  'Recovering',
];

const COMFORT_FILTERS: ('All' | SkinComfortLevel)[] = [
  'All',
  ...COMFORT_OPTIONS,
];

function getTodayISO(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export const SkinJournalScreen: React.FC = () => {
  const { journalEntries, addJournalEntry, deleteJournalEntry, navigate, language, t } = useApp();

  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<'All' | SkinComfortLevel>('All');

  const [date, setDate] = useState(getTodayISO);
  const [comfort, setComfort] = useState<SkinComfortLevel>('Calm');
  const [hydrationScore, setHydrationScore] = useState<number>(4);
  const [productsUsed, setProductsUsed] = useState<string[]>([
    'OCZE+ Soothing Cream',
    'OCZE+ Ultra Hydrating Moisturiser',
  ]);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  const avgHydration = useMemo(() => {
    if (journalEntries.length === 0) return '—';
    const sum = journalEntries.reduce((acc, e) => acc + e.hydrationScore, 0);
    return (sum / journalEntries.length).toFixed(1);
  }, [journalEntries]);

  const latestComfort = journalEntries[0]
    ? t.skinJournal.comfortLabels[journalEntries[0].comfort]
    : t.skinJournal.noLogs;

  const filteredEntries = useMemo(() => {
    if (filter === 'All') return journalEntries;
    return journalEntries.filter((e) => e.comfort === filter);
  }, [journalEntries, filter]);

  const toggleProduct = (name: string) => {
    setProductsUsed((prev) =>
      prev.includes(name) ? prev.filter((p) => p !== name) : [...prev, name]
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!date) {
      setError(
        language === 'ms'
          ? 'Sila pilih tarikh untuk rekod ini.'
          : 'Please choose a date for this entry.'
      );
      return;
    }
    if (!notes.trim()) {
      setError(
        language === 'ms'
          ? 'Sila tulis nota ringkas mengenai rasa kulit anda hari ini.'
          : 'Please write a short note about how your skin felt today.'
      );
      return;
    }

    addJournalEntry({
      date,
      comfort,
      hydrationScore,
      productsUsed,
      notes,
    });

    setNotes('');
    setDate(getTodayISO());
    setComfort('Calm');
    setHydrationScore(4);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-[#FAF8FD] pb-24">
      <TopHeader title={t.skinJournal.title} showBack showCart />

      <main className="px-4 pt-4 space-y-5">
        {/* Summary Card */}
        <section className="rounded-3xl bg-gradient-to-br from-[#E9E1F3] via-white to-[#F7EAF1] border border-[#DDD3EE] p-5 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[12px] font-semibold text-[#5B4B8A]">
                {t.skinJournal.badge}
              </p>
              <h1 className="mt-1 font-display text-[21px] font-bold text-[#221E2C]">
                {t.skinJournal.heroTitle}
              </h1>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-white border border-[#E9E1F3] flex items-center justify-center text-[#6D5D9B] shrink-0">
              <NotebookPen className="w-5 h-5" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#E5DCEF] text-center">
            <div className="bg-white/80 rounded-2xl p-2.5">
              <p className="text-[11px] text-[#635B73]">{t.skinJournal.entries}</p>
              <p className="font-display text-[18px] font-bold text-[#221E2C] tabular-nums">
                {journalEntries.length}
              </p>
            </div>
            <div className="bg-white/80 rounded-2xl p-2.5">
              <p className="text-[11px] text-[#635B73]">{t.skinJournal.avgHydration}</p>
              <p className="font-display text-[18px] font-bold text-[#221E2C] tabular-nums">
                {avgHydration}/5
              </p>
            </div>
            <div className="bg-white/80 rounded-2xl p-2.5">
              <p className="text-[11px] text-[#635B73]">{t.skinJournal.latest}</p>
              <p className="font-display text-[13px] font-bold text-[#5B4B8A] truncate mt-1">
                {latestComfort}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => setShowForm((prev) => !prev)}
              className="min-h-[44px] px-3 py-2 rounded-xl bg-[#7C69AE] hover:bg-[#6A579C] text-white text-[13px] font-semibold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{showForm ? t.skinJournal.closeForm : t.skinJournal.newEntry}</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('skin-guide')}
              className="min-h-[44px] px-3 py-2 rounded-xl bg-white hover:bg-[#FAF8FD] border border-[#D8CBEB] text-[#4F407A] text-[13px] font-semibold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>{t.skinJournal.skinGuide}</span>
            </button>
          </div>
        </section>

        {/* New Journal Entry Form */}
        {showForm && (
          <form
            onSubmit={handleSave}
            className="bg-white rounded-3xl border border-[#E9E1F3] p-5 space-y-4"
            noValidate
          >
            <h2 className="font-display text-[18px] font-bold text-[#221E2C]">
              {t.skinJournal.formTitle}
            </h2>

            {error && (
              <div
                role="alert"
                className="p-3 rounded-xl bg-[#FDF2F6] border border-[#E9BFD2] text-[#8E355B] text-[13px]"
              >
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="journal-date"
                className="block text-[13px] font-medium text-[#221E2C] mb-1.5"
              >
                {t.skinJournal.date}
              </label>
              <input
                id="journal-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full min-h-[44px] px-3.5 rounded-xl border border-[#DDD3EE] bg-[#FAF8FD] text-[14px] text-[#221E2C] focus:bg-white focus:border-[#7C69AE] focus:outline-none"
              />
            </div>

            <div>
              <span className="block text-[13px] font-medium text-[#221E2C] mb-1.5">
                {t.skinJournal.comfortQuestion}
              </span>
              <div className="grid grid-cols-2 gap-2">
                {COMFORT_OPTIONS.map((option) => {
                  const selected = comfort === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setComfort(option)}
                      className={`min-h-[42px] px-3 py-2 rounded-xl text-[13px] font-medium border transition-colors cursor-pointer ${
                        selected
                          ? 'bg-[#7C69AE] border-[#7C69AE] text-white'
                          : 'bg-[#FAF8FD] border-[#DDD3EE] text-[#4B445A] hover:border-[#A092C5]'
                      }`}
                    >
                      {t.skinJournal.comfortLabels[option]}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <span className="block text-[13px] font-medium text-[#221E2C] mb-1.5">
                {t.skinJournal.hydrationLevel} ({hydrationScore}/5)
              </span>
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((score) => {
                  const active = hydrationScore === score;
                  return (
                    <button
                      key={score}
                      type="button"
                      onClick={() => setHydrationScore(score)}
                      className={`min-h-[42px] rounded-xl text-[14px] font-semibold border tabular-nums transition-colors cursor-pointer ${
                        active
                          ? 'bg-[#E9E1F3] border-[#7C69AE] text-[#4F407A]'
                          : 'bg-[#FAF8FD] border-[#DDD3EE] text-[#635B73]'
                      }`}
                    >
                      {score}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <span className="block text-[13px] font-medium text-[#221E2C] mb-1.5">
                {t.skinJournal.productsUsed}
              </span>
              <div className="space-y-2">
                {PRODUCTS.map((p) => {
                  const checked = productsUsed.includes(p.name);
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => toggleProduct(p.name)}
                      className={`w-full min-h-[42px] px-3.5 py-2 rounded-xl border flex items-center justify-between text-left text-[13px] transition-colors cursor-pointer ${
                        checked
                          ? 'bg-[#F6F2FB] border-[#7C69AE] text-[#221E2C] font-medium'
                          : 'bg-[#FAF8FD] border-[#E9E1F3] text-[#635B73]'
                      }`}
                    >
                      <span className="truncate">{p.name}</span>
                      <span
                        className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${
                          checked
                            ? 'bg-[#7C69AE] text-white'
                            : 'border border-[#C8B9E2] bg-white'
                        }`}
                      >
                        {checked && <Check className="w-3.5 h-3.5" />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label
                htmlFor="journal-notes"
                className="block text-[13px] font-medium text-[#221E2C] mb-1.5"
              >
                {t.skinJournal.dailyNotes}
              </label>
              <textarea
                id="journal-notes"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t.skinJournal.notesPlaceholder}
                className="w-full p-3.5 rounded-xl border border-[#DDD3EE] bg-[#FAF8FD] text-[14px] text-[#221E2C] focus:bg-white focus:border-[#7C69AE] focus:outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full min-h-[46px] px-5 py-2.5 rounded-xl bg-[#7C69AE] hover:bg-[#6A579C] text-white text-[14px] font-semibold transition-colors cursor-pointer"
            >
              {t.skinJournal.saveEntry}
            </button>
          </form>
        )}

        {/* Filter Tabs */}
        <div
          role="tablist"
          aria-label={t.skinJournal.title}
          className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5"
        >
          {COMFORT_FILTERS.map((item) => {
            const active = filter === item;
            const label =
              item === 'All'
                ? t.skinJournal.allFilter
                : t.skinJournal.comfortLabels[item];
            return (
              <button
                key={item}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(item)}
                className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-[13px] font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  active
                    ? 'bg-[#7C69AE] text-white'
                    : 'bg-white border border-[#E9E1F3] text-[#635B73] hover:text-[#221E2C]'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Journal Entries Timeline */}
        <section className="space-y-3">
          {filteredEntries.length === 0 ? (
            <div className="bg-white rounded-3xl border border-[#E9E1F3] p-7 text-center">
              <p className="font-display text-[17px] font-semibold text-[#221E2C]">
                {t.skinJournal.emptyTitle}
              </p>
              <p className="mt-1.5 text-[13px] text-[#635B73]">
                {t.skinJournal.emptyDesc}
              </p>
              <button
                type="button"
                onClick={() => {
                  setFilter('All');
                  setShowForm(true);
                }}
                className="mt-4 min-h-[44px] px-5 py-2 rounded-xl bg-[#7C69AE] text-white text-[13px] font-semibold cursor-pointer"
              >
                {t.skinJournal.addFirst}
              </button>
            </div>
          ) : (
            filteredEntries.map((entry) => (
              <article
                key={entry.id}
                className="bg-white rounded-2xl border border-[#E9E1F3] p-4 space-y-3"
              >
                <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-[#F2ECF9]">
                  <div>
                    <div className="flex items-center gap-2 text-[12px] text-[#635B73]">
                      <Calendar className="w-3.5 h-3.5 text-[#6D5D9B]" />
                      <span className="tabular-nums font-medium text-[#221E2C]">
                        {entry.date}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="font-semibold text-[#6D5D9B]">
                        {t.skinJournal.comfortLabels[entry.comfort]}
                      </span>
                    </div>
                    <p className="mt-1 inline-flex items-center gap-1 text-[12px] text-[#635B73] tabular-nums">
                      <Droplets className="w-3.5 h-3.5 text-[#7C69AE]" />
                      <span>{t.skinJournal.hydrationPrefix} {entry.hydrationScore}/5</span>
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => deleteJournalEntry(entry.id)}
                    aria-label={language === 'ms' ? 'Padam rekod jurnal' : 'Delete journal entry'}
                    className="min-h-[38px] min-w-[38px] -mr-1.5 -mt-1 flex items-center justify-center rounded-lg text-[#7B7487] hover:text-[#8E355B] hover:bg-[#FDF2F6] transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-[14px] text-[#4B445A] leading-relaxed">
                  {language === 'ms' && entry.id === 'jr-demo-1'
                    ? 'Kulit terasa lembut dan selesa selepas mandi petang. Tiada rasa tegang sebelum tidur.'
                    : language === 'ms' && entry.id === 'jr-demo-2'
                    ? 'Sapukan lapisan nipis pada kawasan kering di sekitar siku pada waktu pagi dan malam. Kemerahan jelas semakin reda.'
                    : entry.notes}
                </p>

                {entry.productsUsed.length > 0 && (
                  <p className="text-[12px] text-[#635B73] pt-1">
                    <span className="font-semibold text-[#221E2C]">{t.skinJournal.routinePrefix} </span>
                    {entry.productsUsed.join(' · ')}
                  </p>
                )}
              </article>
            ))
          )}
        </section>
      </main>
    </div>
  );
};
