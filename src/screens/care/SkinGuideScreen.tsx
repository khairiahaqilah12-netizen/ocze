import React, { useState } from 'react';
import {
  AlertCircle,
  BookOpen,
  CalendarDays,
  Check,
  Droplets,
  HeartHandshake,
  NotebookPen,
  ShieldCheck,
  Sparkles,
  Sun,
} from 'lucide-react';
import { TopHeader } from '../../components/layout/TopHeader';
import { getProductById } from '../../data/products';
import { useApp } from '../../context/AppContext';
import { AppLanguage } from '../../types';
import { formatRM } from '../../utils/format';

type ConditionKey = 'ekzema' | 'psoriasis' | 'sensitif' | 'ruam' | 'luka';
type StageKey = 'awal' | 'sederhana' | 'teruk';

interface StageGuide {
  label: string;
  symptoms: string;
  steps: string[];
}

interface ConditionGuide {
  shortLabel: string;
  title: string;
  subtitle?: string;
  hasStages: boolean;
  stages?: Record<StageKey, StageGuide>;
  steps?: string[];
  warning?: string;
  recommendedIds: string[];
}

const CONDITION_GUIDES: Record<AppLanguage, Record<ConditionKey, ConditionGuide>> = {
  en: {
    ekzema: {
      shortLabel: 'Eczema',
      title: 'Eczema Care Guide',
      subtitle: 'Select your current skin stage for the most suitable OCZE+ application routine.',
      hasStages: true,
      stages: {
        awal: {
          label: 'Early Stage',
          symptoms: 'Mild itchiness, dryness, and slight redness.',
          steps: [
            'Cleanse the affected area with clean lukewarm water (avoid harsh soaps containing parabens, fragrance, and SLS).',
            'Apply a thin layer of OCZE+ Soothing Cream 2–3 times daily: morning, afternoon, and night.',
            'Layer OCZE+ Ultra Hydrating Moisturiser over the same area 2–3 times daily: morning, afternoon, and night.',
            'Avoid scratching the affected area. If itchy, gently apply a cool compress before putting on OCZE+.',
          ],
        },
        sederhana: {
          label: 'Moderate Stage',
          symptoms: 'Noticeable redness, flaky skin, or small cracks.',
          steps: [
            'Cleanse the affected area gently and avoid rubbing or scrubbing the skin.',
            'Apply a moderate layer of OCZE+ Soothing Cream 3 times daily: morning, afternoon, and night.',
            'Once absorbed, top up with OCZE+ Ultra Hydrating Moisturiser over the same area 2–3 times daily.',
            'Nighttime: Wrap the area gently with soft cotton cloth or cotton socks after applying cream for a lock-in moisture effect.',
          ],
        },
        teruk: {
          label: 'Severe Stage',
          symptoms: 'Open sores, bleeding, weeping skin, and cracked patches.',
          steps: [
            'Gently rinse the affected area with clean lukewarm water. Do not use soaps containing fragrance, SLS, or parabens.',
            'Pat dry gently with soft tissue — never rub the sensitive skin.',
            'Apply a thicker layer of OCZE+ Soothing Cream 4 times daily.',
            'Once open areas calm down and begin healing, follow up with OCZE+ Ultra Hydrating Moisturiser for lasting barrier protection.',
          ],
        },
      },
      recommendedIds: ['complete-set', 'soothing-cream', 'ultra-hydrating-moisturiser'],
    },
    psoriasis: {
      shortLabel: 'Psoriasis',
      title: 'Psoriasis Care Guide',
      subtitle: 'Consistent daily application helps soften scaly plaques and reduce persistent dryness.',
      hasStages: true,
      stages: {
        awal: {
          label: 'Early Stage',
          symptoms: 'Small red patches with light scaling.',
          steps: [
            'Apply a thin layer of OCZE+ Soothing Cream 2–3 times daily every morning, afternoon, and night.',
            'Follow with a thin layer of OCZE+ Ultra Hydrating Moisturiser 2–3 times daily.',
            'Avoid overly hot or long showers, as hot water strips skin moisture and worsens dryness.',
          ],
        },
        sederhana: {
          label: 'Moderate Stage',
          symptoms: 'Clear scaling, thickened patches, and dry skin.',
          steps: [
            'Right after showering while skin is still slightly damp, apply OCZE+ Soothing Cream 3 times daily.',
            'After a few minutes, apply OCZE+ Ultra Hydrating Moisturiser over the affected areas 3 times daily to lock in hydration.',
            'Drink enough water daily (8–10 glasses) to prevent internal dehydration and surface dryness.',
          ],
        },
        teruk: {
          label: 'Severe Stage',
          symptoms: 'Thickened skin, heavy scaling, cracking, or bleeding.',
          steps: [
            'Soften the affected area first using a gentle warm water compress.',
            'Apply a generous layer of OCZE+ Soothing Cream, allow it to absorb, and repeat consistently 3–4 times daily.',
            'Once cracks close and begin recovering, top up with OCZE+ Ultra Hydrating Moisturiser to seal moisture.',
            'Wear soft cotton gloves during sleep to minimize friction, prevent scratch wounds, and keep moisture sealed overnight.',
          ],
        },
      },
      recommendedIds: ['complete-set', 'twin-care', 'soothing-cream'],
    },
    sensitif: {
      shortLabel: 'Sensitive Skin',
      title: 'Sensitive Skin Care Guide',
      subtitle:
        'Sensitive skin is not eczema or psoriasis, but skin that easily turns red or itchy from harsh products or environmental triggers.',
      hasStages: false,
      steps: [
        'Use OCZE+ Ultra Hydrating Moisturiser as your daily lotion twice a day: morning after showering and night before sleep.',
        'If a sudden flare occurs (redness or itchiness): rinse the face or skin with cool water first.',
        'Apply a thin layer of OCZE+ Soothing Cream on the reactive area and reapply after 4–6 hours if itchiness persists.',
      ],
      recommendedIds: ['complete-set', 'ultra-hydrating-moisturiser', 'soothing-cream'],
    },
    ruam: {
      shortLabel: 'Itch & Rash',
      title: 'Everyday Itch & Mild Rashes',
      subtitle: 'Gentle calming steps to soothe everyday rashes or mild insect bites.',
      hasStages: false,
      steps: [
        'Wash the affected area with clean water and pat dry gently.',
        'Apply a thin layer of OCZE+ Soothing Cream followed by OCZE+ Ultra Hydrating Moisturiser 2–3 times daily.',
        'For insect bites, reapply gently whenever itchiness returns.',
      ],
      warning: 'Seek medical advice promptly if the rash spreads rapidly, swells, weeps pus, or is accompanied by fever.',
      recommendedIds: ['complete-set', 'twin-care', 'soothing-cream'],
    },
    luka: {
      shortLabel: 'Scratch Marks',
      title: 'Scratch Marks & Cracked Skin',
      subtitle: 'Protect scratched or cracked skin while supporting calm, gentle recovery.',
      hasStages: false,
      steps: [
        'Cleanse the area with clean water and pat softly with clean tissue.',
        'Avoid further scratching on the recovering area.',
        'Apply OCZE+ Soothing Cream lightly around and over the recovering edges (avoid rubbing forcefully on open cracks) 2–3 times daily.',
        'Once the skin surface starts closing, layer OCZE+ Ultra Hydrating Moisturiser for optimal recovery.',
      ],
      recommendedIds: ['complete-set', 'soothing-cream', 'ultra-hydrating-moisturiser'],
    },
  },
  ms: {
    ekzema: {
      shortLabel: 'Ekzema',
      title: 'Panduan Penjagaan Ekzema',
      subtitle: 'Pilih tahap keadaan kulit anda untuk langkah penggunaan OCZE+ yang sesuai.',
      hasStages: true,
      stages: {
        awal: {
          label: 'Tahap Awal',
          symptoms: 'Gatal ringan, kering, dan sedikit kemerahan.',
          steps: [
            'Bersihkan kawasan kulit dengan air bersih dan suam (elakkan sabun kuat yang mengandungi paraben, pewangi dan SLS).',
            'Sapukan OCZE+ Soothing Cream secara nipis 2–3 kali sehari iaitu pada pagi, petang dan malam.',
            'Lapiskan dengan OCZE+ Ultra Hydrating Moisturiser di permukaan yang sama 2–3 kali sehari iaitu pada pagi, petang dan malam.',
            'Elakkan menggaru kawasan yang terjejas. Jika gatal, tuam perlahan dengan air sejuk dahulu sebelum menyapu OCZE+.',
          ],
        },
        sederhana: {
          label: 'Tahap Sederhana',
          symptoms: 'Kemerahan jelas, kulit bersisik, atau luka kecil.',
          steps: [
            'Bersihkan dengan lembut pada kawasan yang terjejas dan elakkan daripada menggosok.',
            'Sapukan OCZE+ Soothing Cream dengan lapisan sederhana tebal sebanyak 3 kali sehari iaitu pada pagi, petang dan malam.',
            'Lapiskan dengan OCZE+ Ultra Hydrating Moisturiser di permukaan yang sama setelah krim meresap, sebanyak 2–3 kali sehari (pagi, petang dan malam).',
            'Waktu malam: Balut kawasan kulit dengan kain kapas lembut atau sarung kaki kapas selepas menyapu krim untuk mengunci kelembapan semalaman.',
          ],
        },
        teruk: {
          label: 'Tahap Teruk',
          symptoms: 'Luka, berdarah, berair, dan kulit pecah.',
          steps: [
            'Cuci kawasan yang terjejas secara perlahan menggunakan air bersih dan suam. Elakkan sabun yang mengandungi pewangi, SLS dan paraben.',
            'Keringkan dengan tisu lembut secara menekap perlahan — jangan gosok kawasan yang sensitif.',
            'Sapukan OCZE+ Soothing Cream dengan lapisan tebal sebanyak 4 kali sehari.',
            'Setelah kawasan tersebut tidak lagi luka dan mula pulih, lapiskan dengan OCZE+ Ultra Hydrating Moisturiser untuk perlindungan optimum.',
          ],
        },
      },
      recommendedIds: ['complete-set', 'soothing-cream', 'ultra-hydrating-moisturiser'],
    },
    psoriasis: {
      shortLabel: 'Psoriasis',
      title: 'Panduan Penjagaan Psoriasis',
      subtitle: 'Penggunaan konsisten membantu melembutkan kawasan bersisik dan mengurangkan kekeringan.',
      hasStages: true,
      stages: {
        awal: {
          label: 'Tahap Awal',
          symptoms: 'Tompok merah kecil dan pengelupasan nipis.',
          steps: [
            'Sapukan OCZE+ Soothing Cream secara nipis 2–3 kali sehari iaitu setiap pagi, petang dan malam.',
            'Lapiskan dengan OCZE+ Ultra Hydrating Moisturiser secara nipis 2–3 kali sehari iaitu setiap pagi, petang dan malam.',
            'Elakkan mandi terlalu lama dengan air panas kerana ia boleh menyebabkan kulit menjadi semakin kering.',
          ],
        },
        sederhana: {
          label: 'Tahap Sederhana',
          symptoms: 'Pengelupasan jelas, kulit tebal dan kering.',
          steps: [
            'Selepas mandi ketika kulit masih sedikit lembap, sapukan OCZE+ Soothing Cream 3 kali sehari iaitu pada pagi, petang dan malam.',
            'Selepas beberapa minit, sapukan OCZE+ Ultra Hydrating Moisturiser pada kawasan yang terjejas sebanyak 3 kali sehari bagi mengekalkan kelembapan kulit.',
            'Minum air secukupnya (8–10 gelas sehari) untuk mengelakkan dehidrasi dan kekeringan kulit.',
          ],
        },
        teruk: {
          label: 'Tahap Teruk',
          symptoms: 'Kulit sangat tebal, pengelupasan banyak, pecah atau berdarah.',
          steps: [
            'Lembapkan dahulu kawasan yang terjejas dengan tuaman air suam.',
            'Sapukan OCZE+ Soothing Cream dengan lapisan tebal, biarkan meresap dan amalkan secara konsisten 3–4 kali sehari.',
            'Setelah kulit tidak lagi pecah dan mula membaik, lapiskan dengan OCZE+ Ultra Hydrating Moisturiser untuk mengunci kelembapan kulit.',
            'Pakai sarung tangan kapas ketika tidur bagi mengurangkan geseran, mencegah luka akibat garu, dan mengekalkan kelembapan selepas menyapu OCZE+.',
          ],
        },
      },
      recommendedIds: ['complete-set', 'twin-care', 'soothing-cream'],
    },
    sensitif: {
      shortLabel: 'Kulit Sensitif',
      title: 'Panduan Kulit Sensitif',
      subtitle:
        'Kulit sensitif bukanlah ekzema atau psoriasis, tetapi kulit yang mudah merah atau gatal apabila tersalah penggunaan produk atau terdedah kepada faktor persekitaran.',
      hasStages: false,
      steps: [
        'Gunakan OCZE+ Ultra Hydrating Moisturiser sebagai losyen harian, sapukan 2 kali sehari iaitu pagi selepas mandi dan malam sebelum tidur.',
        'Sekiranya kulit tiba-tiba meradang (merah atau gatal): bilas wajah atau kulit dengan air sejuk terlebih dahulu.',
        'Sapukan OCZE+ Soothing Cream secara nipis pada kawasan tersebut dan ulang selepas 4–6 jam jika masih terasa gatal.',
      ],
      recommendedIds: ['complete-set', 'ultra-hydrating-moisturiser', 'soothing-cream'],
    },
    ruam: {
      shortLabel: 'Gatal & Ruam',
      title: 'Kulit Gatal Biasa & Ruam',
      subtitle: 'Langkah lembut untuk meredakan ruam ringan atau kesan gigitan serangga.',
      hasStages: false,
      steps: [
        'Cuci kawasan yang terjejas dengan air bersih dan keringkan secara lembut.',
        'Sapukan OCZE+ Soothing Cream dan OCZE+ Ultra Hydrating Moisturiser secara nipis 2–3 kali sehari.',
        'Sekiranya berpunca daripada gigitan serangga, ulang sapuan secara lembut setiap kali terasa gatal.',
      ],
      warning: 'Jumpa doktor dengan segera jika ruam merebak cepat, membengkak, bernanah, atau disertai demam.',
      recommendedIds: ['complete-set', 'twin-care', 'soothing-cream'],
    },
    luka: {
      shortLabel: 'Luka Garu',
      title: 'Kulit Luka atau Pecah Akibat Garu',
      subtitle: 'Lindungi kulit yang pecah akibat menggaru dan sokong pemulihan secara lembut.',
      hasStages: false,
      steps: [
        'Cuci kawasan yang terjejas dengan air bersih dan tekap lembut dengan tisu.',
        'Elakkan daripada terus menggaru di bahagian yang terjejas.',
        'Sapukan OCZE+ Soothing Cream secara nipis di sekeliling luka (jangan gosok terlalu kuat di atas luka terbuka) sebanyak 2–3 kali sehari iaitu pagi, petang dan malam.',
        'Setelah kawasan tersebut mula pulih, lapiskan dengan OCZE+ Ultra Hydrating Moisturiser untuk kesan pemulihan yang optimum.',
      ],
      recommendedIds: ['complete-set', 'soothing-cream', 'ultra-hydrating-moisturiser'],
    },
  },
};

const GENERAL_GUIDELINES: Record<AppLanguage, string[]> = {
  en: [
    'Use OCZE+ Twin Care consistently every day for more optimal calming and barrier support.',
    'Avoid mixing too many products at once so you can clearly observe what works best for your skin.',
    'Monitor food and daily lifestyle, as stress and specific trigger foods may prompt flare-ups.',
    'Drink at least 8–10 glasses of water daily to support skin hydration from within.',
    'Shield sensitive skin from harsh midday sun with an umbrella or breathable protective clothing.',
    'Maintain indoor humidity with a humidifier or water bowl in air-conditioned rooms so skin does not dry out rapidly.',
  ],
  ms: [
    'Gunakan OCZE+ Twin Care secara konsisten setiap hari untuk mendapatkan kesan kelegaan dan perlindungan kulit yang lebih optimum.',
    'Jangan campur penggunaan terlalu banyak produk serentak supaya anda mudah mengenal pasti produk yang benar-benar serasi.',
    'Pantau pemakanan dan gaya hidup harian kerana tekanan serta makanan tertentu boleh mencetuskan keradangan semula.',
    'Minum air sekurang-kurangnya 8–10 gelas sehari untuk mengekalkan kelembapan kulit dari dalam.',
    'Lindungi kulit daripada cahaya matahari terik — gunakan payung atau pakaian pelindung apabila berada di luar.',
    'Kekalkan kelembapan udara dengan menggunakan pelembap udara atau meletakkan bekas air di dalam bilik berhawa dingin supaya kulit tidak cepat kering.',
  ],
};

const PANTANG_LIFESTYLE_TIPS: Record<AppLanguage, { title: string; detail: string }[]> = {
  en: [
    {
      title: 'Avoid Trigger Foods',
      detail: 'Reduce personal trigger foods such as shellfish, eggs, dairy, and spicy dishes depending on your skin’s reaction.',
    },
    {
      title: 'Manage Stress & Sleep Well',
      detail: 'Keep daily stress in check and aim for consistent restful sleep to support the skin’s natural recovery cycle.',
    },
    {
      title: 'Fragrance-Free Gentle Cleanser',
      detail: 'Use a gentle cleanser free from fragrance, parabens, and SLS such as OCZE+ CalmSkin Shower Therapy to prevent irritation.',
    },
    {
      title: '8–10 Glasses Hydration Daily',
      detail: 'Drink at least 8–10 glasses of plain water daily to keep skin supple and hydrated.',
    },
  ],
  ms: [
    {
      title: 'Elakkan Makanan Pencetus',
      detail: 'Kurangkan makanan pencetus seperti makanan laut, telur, susu dan makanan pedas bergantung kepada tindak balas kulit anda.',
    },
    {
      title: 'Kawal Tekanan & Tidur Mencukupi',
      detail: 'Urus tekanan harian dan pastikan waktu tidur mencukupi bagi membantu proses pemulihan semula jadi kulit.',
    },
    {
      title: 'Pencuci Lembut Bebas Pewangi',
      detail: 'Gunakan pencuci badan yang lembut, bebas pewangi, paraben dan SLS seperti OCZE+ CalmSkin Shower Therapy bagi mengelakkan iritasi.',
    },
    {
      title: 'Penghidratan 8–10 Gelas Sehari',
      detail: 'Minum air kosong sekurang-kurangnya 8–10 gelas setiap hari untuk menyokong kelembapan dan keanjalan kulit.',
    },
  ],
};

const PROGRESS_TIMELINE: Record<AppLanguage, { days: string; phase: string; points: string[] }[]> = {
  en: [
    {
      days: 'Days 1–3',
      phase: 'Initial Calming Phase',
      points: [
        'Skin may still feel itchy, dry, or slightly flaky as it adjusts to a gentler routine.',
        'Continue using OCZE+ as guided. Avoid scratching, use a fragrance-free cleanser, and stay hydrated.',
      ],
    },
    {
      days: 'Days 4–6',
      phase: 'Redness & Irritation Ease',
      points: [
        'Visible irritation starts to calm; itching and redness gradually become milder.',
        'Maintain your gentle skincare routine and avoid trigger foods (such as seafood, eggs, and spicy food) if needed.',
      ],
    },
    {
      days: 'Days 7–9',
      phase: 'Smoother Skin Texture',
      points: [
        'Skin begins feeling softer, more hydrated, and noticeably more even in texture.',
        'Stay consistent with OCZE+, get quality rest, and manage daily stress to support recovery.',
      ],
    },
    {
      days: 'Days 10–12',
      phase: 'Stronger & Calmer Barrier',
      points: [
        'Skin looks healthier and calmer, moisture retention improves, and sensitivity eases.',
        'Continue balanced nutrition and gentle daily habits.',
      ],
    },
    {
      days: 'Days 13–14',
      phase: 'Protection & Flare Prevention',
      points: [
        'Continue with OCZE+ Ultra Hydrating Moisturiser daily to lock in moisture, strengthen the skin barrier, and help prevent recurring irritation.',
      ],
    },
  ],
  ms: [
    {
      days: 'Hari 1–3',
      phase: 'Fasa Awal Pemulihan',
      points: [
        'Kulit mungkin masih terasa gatal, kering atau sedikit mengelupas akibat proses penyesuaian awal.',
        'Teruskan penggunaan OCZE+ mengikut panduan. Elakkan menggaru, guna pencuci lembut tanpa pewangi, dan pastikan pengambilan air mencukupi.',
      ],
    },
    {
      days: 'Hari 4–6',
      phase: 'Kemerahan & Keradangan Mula Reda',
      points: [
        'Tanda-tanda keradangan mula berkurang; rasa gatal dan kemerahan beransur reda.',
        'Kekalkan rutin penjagaan kulit yang lembut dan elakkan makanan pencetus (seperti makanan laut, telur dan makanan pedas) sekiranya perlu.',
      ],
    },
    {
      days: 'Hari 7–9',
      phase: 'Tekstur Kulit Lebih Sekata',
      points: [
        'Kulit mula menunjukkan tekstur lebih sekata dan lembap. Parut halus atau kesan kering beransur pulih.',
        'Teruskan penggunaan OCZE+ secara konsisten, tidur mencukupi dan kawal tekanan bagi menyokong pemulihan.',
      ],
    },
    {
      days: 'Hari 10–12',
      phase: 'Kulit Lebih Sihat & Stabil',
      points: [
        'Kulit kelihatan lebih sihat dan stabil, tahap kelembapan meningkat, dan sensitiviti berkurang.',
        'Teruskan gaya hidup sihat serta amalkan pemakanan secara seimbang.',
      ],
    },
    {
      days: 'Hari 13–14',
      phase: 'Perlindungan & Pencegahan Berulang',
      points: [
        'Teruskan dengan OCZE+ Ultra Hydrating Moisturiser bagi mengekalkan kelembapan, menguatkan lapisan perlindungan kulit, dan mencegah iritasi berulang kembali.',
      ],
    },
  ],
};

const SOOTHING_BENEFITS: Record<AppLanguage, string[]> = {
  en: [
    'Reduces redness',
    'Calms itchiness',
    'Eases inflammation',
    'Soothes eczema flare-ups',
    'Reduces mild swelling',
  ],
  ms: [
    'Mengurangkan kemerahan',
    'Mengurangkan kegatalan',
    'Mengurangkan keradangan',
    'Meredakan simptom ekzema',
    'Mengurangkan pembengkakan',
  ],
};

const MOISTURISER_BENEFITS: Record<AppLanguage, string[]> = {
  en: [
    'Locks in moisture',
    'Prevents dry skin',
    'Supports faster recovery',
    'Delivers deep hydration',
    'Restores flaky & dry patches',
  ],
  ms: [
    'Mengekalkan kelembapan',
    'Mengelakkan kulit kering',
    'Mempercepat proses pemulihan',
    'Membekalkan hidrasi mendalam',
    'Memulih kulit rosak & mengelupas',
  ],
};

export const SkinGuideScreen: React.FC = () => {
  const { navigate, addToCart, language, t } = useApp();
  const [selectedCondition, setSelectedCondition] = useState<ConditionKey>('ekzema');
  const [selectedStage, setSelectedStage] = useState<StageKey>('awal');
  const [careTab, setCareTab] = useState<'panduan' | 'pantang'>('panduan');

  const guides = CONDITION_GUIDES[language];
  const activeCondition = guides[selectedCondition];
  const activeStage =
    activeCondition.hasStages && activeCondition.stages
      ? activeCondition.stages[selectedStage]
      : null;

  const soothingCream = getProductById('soothing-cream');
  const moisturiser = getProductById('ultra-hydrating-moisturiser');
  const twinCare = getProductById('twin-care');

  const soothingBenefits = SOOTHING_BENEFITS[language];
  const moisturiserBenefits = MOISTURISER_BENEFITS[language];
  const guidelines = GENERAL_GUIDELINES[language];
  const pantangTips = PANTANG_LIFESTYLE_TIPS[language];
  const timeline = PROGRESS_TIMELINE[language];

  return (
    <div className="min-h-screen bg-[#FAF8FD] pb-24">
      <TopHeader title={t.skinGuide.title} showBack showCart />

      <main className="px-4 pt-4 space-y-6">
        {/* Welcome Banner */}
        <section className="rounded-3xl bg-gradient-to-br from-[#E9E1F3] via-white to-[#F7EAF1] border border-[#DDD3EE] p-5 space-y-3">
          <div className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#5B4B8A]">
            <BookOpen className="w-4 h-4" />
            <span>{t.skinGuide.badge}</span>
          </div>
          <h1 className="font-display text-[22px] font-bold text-[#221E2C] leading-tight">
            {t.skinGuide.heroTitle}
          </h1>
          <p className="text-[13px] text-[#4B445A] leading-relaxed">
            {t.skinGuide.heroDesc}
          </p>
          <button
            type="button"
            onClick={() => navigate('skin-journal')}
            className="w-full min-h-[44px] px-4 py-2 rounded-xl bg-white hover:bg-[#FAF8FD] border border-[#D8CBEB] text-[#4F407A] text-[13px] font-semibold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <NotebookPen className="w-4 h-4" />
            <span>{t.skinGuide.logProgressBtn}</span>
          </button>
        </section>

        {/* Duo Benefits Comparison */}
        <section className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-display text-[18px] font-bold text-[#221E2C]">
              {t.skinGuide.twinBenefitsTitle}
            </h2>
            {twinCare && twinCare.sellingPrice !== null && (
              <button
                type="button"
                onClick={() => navigate('product-detail', { productId: twinCare.id })}
                className="text-[12px] font-semibold text-[#6D5D9B] hover:text-[#4F407A] cursor-pointer"
              >
                {language === 'ms' ? 'Set Percubaan' : 'Trial Set'} · {formatRM(twinCare.sellingPrice)}
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {soothingCream && (
              <div className="bg-white rounded-2xl border border-[#E9E1F3] p-3.5 flex flex-col justify-between">
                <div>
                  <button
                    type="button"
                    onClick={() => navigate('product-detail', { productId: soothingCream.id })}
                    className="w-full aspect-square rounded-xl bg-[#FAF8FD] border border-[#F0E9F8] p-2 mb-2.5 cursor-pointer"
                  >
                    <img
                      src={soothingCream.images[0]}
                      alt={soothingCream.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain"
                    />
                  </button>
                  <h3 className="font-display text-[13px] font-bold text-[#221E2C] leading-snug">
                    Soothing Cream
                  </h3>
                  <ul className="mt-2 space-y-1.5">
                    {soothingBenefits.map((item) => (
                      <li key={item} className="flex items-start gap-1.5 text-[11px] text-[#4B445A] leading-snug">
                        <Check className="w-3.5 h-3.5 text-[#7C69AE] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  type="button"
                  onClick={() => addToCart(soothingCream.id, 1)}
                  className="mt-3 w-full min-h-[36px] px-2.5 py-1 rounded-lg bg-[#F6F2FB] hover:bg-[#E9E1F3] text-[#4F407A] text-[12px] font-semibold cursor-pointer"
                >
                  {t.common.add} · {formatRM(soothingCream.sellingPrice!)}
                </button>
              </div>
            )}

            {moisturiser && (
              <div className="bg-white rounded-2xl border border-[#E9E1F3] p-3.5 flex flex-col justify-between">
                <div>
                  <button
                    type="button"
                    onClick={() => navigate('product-detail', { productId: moisturiser.id })}
                    className="w-full aspect-square rounded-xl bg-[#FAF8FD] border border-[#F0E9F8] p-2 mb-2.5 cursor-pointer"
                  >
                    <img
                      src={moisturiser.images[0]}
                      alt={moisturiser.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain"
                    />
                  </button>
                  <h3 className="font-display text-[13px] font-bold text-[#221E2C] leading-snug">
                    Ultra Hydrating Moisturiser
                  </h3>
                  <ul className="mt-2 space-y-1.5">
                    {moisturiserBenefits.map((item) => (
                      <li key={item} className="flex items-start gap-1.5 text-[11px] text-[#4B445A] leading-snug">
                        <Check className="w-3.5 h-3.5 text-[#8C4D6D] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  type="button"
                  onClick={() => addToCart(moisturiser.id, 1)}
                  className="mt-3 w-full min-h-[36px] px-2.5 py-1 rounded-lg bg-[#F7EAF1] hover:bg-[#EED7E4] text-[#7A3F5D] text-[12px] font-semibold cursor-pointer"
                >
                  {t.common.add} · {formatRM(moisturiser.sellingPrice!)}
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Condition & Stage Selector */}
        <section className="space-y-3">
          <h2 className="font-display text-[18px] font-bold text-[#221E2C]">
            {t.skinGuide.conditionTitle}
          </h2>

          <div
            role="tablist"
            aria-label={t.skinGuide.conditionTitle}
            className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5"
          >
            {(Object.keys(guides) as ConditionKey[]).map((key) => {
              const active = selectedCondition === key;
              return (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setSelectedCondition(key)}
                  className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-[13px] font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#7C69AE] text-white'
                      : 'bg-white border border-[#E9E1F3] text-[#635B73] hover:text-[#221E2C]'
                  }`}
                >
                  {guides[key].shortLabel}
                </button>
              );
            })}
          </div>

          <div className="bg-white rounded-3xl border border-[#E9E1F3] p-5 space-y-4">
            <div>
              <h3 className="font-display text-[17px] font-bold text-[#221E2C]">
                {activeCondition.title}
              </h3>
              {activeCondition.subtitle && (
                <p className="mt-1 text-[13px] text-[#635B73] leading-relaxed">
                  {activeCondition.subtitle}
                </p>
              )}
            </div>

            {activeCondition.hasStages && activeCondition.stages && (
              <div className="grid grid-cols-3 gap-2">
                {(['awal', 'sederhana', 'teruk'] as StageKey[]).map((stageKey) => {
                  const stageActive = selectedStage === stageKey;
                  const stageLabel = activeCondition.stages![stageKey].label;
                  return (
                    <button
                      key={stageKey}
                      type="button"
                      onClick={() => setSelectedStage(stageKey)}
                      className={`min-h-[40px] px-2 py-1.5 rounded-xl text-[12px] font-semibold border transition-colors cursor-pointer ${
                        stageActive
                          ? 'bg-[#E9E1F3] border-[#7C69AE] text-[#4F407A]'
                          : 'bg-[#FAF8FD] border-[#E9E1F3] text-[#635B73]'
                      }`}
                    >
                      {stageLabel}
                    </button>
                  );
                })}
              </div>
            )}

            {activeStage && (
              <div className="rounded-2xl bg-[#F6F2FB] border border-[#DDD3EE] p-3.5">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-[#5B4B8A]">
                  {t.skinGuide.signLabel} · {activeStage.label}
                </p>
                <p className="mt-1 text-[13px] font-medium text-[#221E2C]">
                  {activeStage.symptoms}
                </p>
              </div>
            )}

            <ol className="space-y-3 pt-1">
              {(activeStage ? activeStage.steps : activeCondition.steps || []).map((step, index) => (
                <li key={step} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#7C69AE] text-white text-[12px] font-bold flex items-center justify-center shrink-0 mt-0.5 tabular-nums">
                    {index + 1}
                  </span>
                  <span className="text-[13px] text-[#4B445A] leading-relaxed">
                    {step}
                  </span>
                </li>
              ))}
            </ol>

            {activeCondition.warning && (
              <div className="rounded-2xl bg-[#FDF2F6] border border-[#E9BFD2] p-3.5 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-[#8E355B] shrink-0 mt-0.5" />
                <p className="text-[12px] text-[#8E355B] leading-relaxed font-medium">
                  {activeCondition.warning}
                </p>
              </div>
            )}

            {/* Recommended Products for Selected Condition */}
            <div className="pt-3 border-t border-[#F2ECF9] space-y-2.5">
              <p className="text-[12px] font-semibold text-[#6D5D9B]">
                {t.skinGuide.recommendedTitle}
              </p>
              <div className="space-y-2">
                {activeCondition.recommendedIds.map((pid) => {
                  const p = getProductById(pid);
                  if (!p) return null;
                  const isBestValue = p.id === 'complete-set';
                  return (
                    <div
                      key={pid}
                      className={`flex items-center justify-between gap-2.5 p-2.5 rounded-2xl border ${
                        isBestValue
                          ? 'bg-[#F6F2FB] border-[#CBBBE8]'
                          : 'bg-[#FAF8FD] border-[#E9E1F3]'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => navigate('product-detail', { productId: p.id })}
                        className="flex items-center gap-2.5 min-w-0 flex-1 text-left cursor-pointer"
                      >
                        <div className="w-12 h-12 rounded-xl bg-white border border-[#EFE7F8] p-1 shrink-0">
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="min-w-0">
                          {isBestValue && (
                            <p className="text-[10px] font-bold uppercase tracking-wide text-[#5B4B8A]">
                              {t.skinGuide.bestValueTag}
                            </p>
                          )}
                          <p className="font-display text-[13px] font-semibold text-[#221E2C] truncate">
                            {p.name}
                          </p>
                          <div className="flex items-baseline gap-1.5 flex-wrap">
                            <span className="text-[12px] text-[#6D5D9B] font-bold tabular-nums">
                              {p.sellingPrice !== null ? formatRM(p.sellingPrice) : ''}
                            </span>
                            {p.originalPrice !== null && (
                              <span className="text-[11px] text-[#7B7487] line-through tabular-nums">
                                {formatRM(p.originalPrice)}
                              </span>
                            )}
                            <span className="text-[11px] text-[#635B73]">
                              · {p.size}
                            </span>
                          </div>
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => addToCart(p.id, 1)}
                        className="min-h-[36px] px-3 py-1 rounded-lg bg-[#7C69AE] hover:bg-[#6A579C] text-white text-[12px] font-semibold shrink-0 cursor-pointer"
                      >
                        {t.common.add}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* General Care & Lifestyle / Pantang Tips */}
        <section className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-display text-[18px] font-bold text-[#221E2C]">
              {t.skinGuide.generalTitle}
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setCareTab('panduan')}
              className={`min-h-[42px] px-3 py-2 rounded-xl text-[13px] font-semibold border transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5 ${
                careTab === 'panduan'
                  ? 'bg-[#7C69AE] border-[#7C69AE] text-white'
                  : 'bg-white border-[#E9E1F3] text-[#635B73]'
              }`}
            >
              <Sun className="w-4 h-4" />
              <span>{t.skinGuide.tabGeneral}</span>
            </button>
            <button
              type="button"
              onClick={() => setCareTab('pantang')}
              className={`min-h-[42px] px-3 py-2 rounded-xl text-[13px] font-semibold border transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5 ${
                careTab === 'pantang'
                  ? 'bg-[#7C69AE] border-[#7C69AE] text-white'
                  : 'bg-white border-[#E9E1F3] text-[#635B73]'
              }`}
            >
              <HeartHandshake className="w-4 h-4" />
              <span>{t.skinGuide.tabPantang}</span>
            </button>
          </div>

          {careTab === 'panduan' ? (
            <div className="bg-white rounded-3xl border border-[#E9E1F3] p-5 space-y-3">
              {guidelines.map((tip, idx) => (
                <div key={tip} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-lg bg-[#E9E1F3] text-[#4F407A] text-[12px] font-bold flex items-center justify-center shrink-0 mt-0.5 tabular-nums">
                    {idx + 1}
                  </span>
                  <p className="text-[13px] text-[#4B445A] leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-[#E9E1F3] divide-y divide-[#F2ECF9]">
              {pantangTips.map((item) => (
                <div key={item.title} className="p-4">
                  <p className="font-display text-[14px] font-semibold text-[#221E2C]">
                    {item.title}
                  </p>
                  <p className="mt-1 text-[13px] text-[#635B73] leading-relaxed">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 14-Day Progress Timeline */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-[#6D5D9B]" />
            <h2 className="font-display text-[18px] font-bold text-[#221E2C]">
              {t.skinGuide.timelineTitle}
            </h2>
          </div>

          <div className="bg-white rounded-3xl border border-[#E9E1F3] p-5 space-y-4">
            {timeline.map((milestone, idx) => (
              <div
                key={milestone.days}
                className={`relative pl-6 ${
                  idx < timeline.length - 1 ? 'pb-4 border-l-2 border-[#E9E1F3]' : ''
                }`}
              >
                <span className="absolute -left-[7px] top-1 w-3 h-3 rounded-full bg-[#7C69AE] ring-4 ring-[#F6F2FB]" />
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-lg bg-[#E9E1F3] text-[#4F407A] text-[11px] font-bold tabular-nums">
                    {milestone.days}
                  </span>
                  <h3 className="font-display text-[14px] font-bold text-[#221E2C]">
                    {milestone.phase}
                  </h3>
                </div>
                <div className="mt-2 space-y-1.5">
                  {milestone.points.map((pt) => (
                    <p key={pt} className="text-[13px] text-[#635B73] leading-relaxed">
                      {pt}
                    </p>
                  ))}
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => navigate('skin-journal')}
              className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-[#7C69AE] hover:bg-[#6A579C] text-white text-[13px] font-semibold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{t.skinGuide.recordProgressBtn}</span>
            </button>
          </div>
        </section>

        {/* Gentle Safety Reminder */}
        <section className="rounded-2xl bg-[#F6F2FB] border border-[#DDD3EE] p-4 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-[#6D5D9B] shrink-0 mt-0.5" />
          <div className="text-[12px] text-[#4B445A] leading-relaxed">
            <p className="font-semibold text-[#221E2C] flex items-center gap-1.5">
              <span>{t.skinGuide.safetyTitle}</span>
              <Droplets className="w-3.5 h-3.5 text-[#6D5D9B]" />
            </p>
            <p className="mt-0.5">
              {t.skinGuide.safetyDesc}
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};
