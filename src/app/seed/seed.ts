import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";
import config from "../config";
import { prisma } from "../shared/prisma";

/* ---------------- SERVICES ---------------- */
const SERVICES_SEED = [
  {
    name: "জাতীয় পরিচয়পত্র (NID) সেবা",
    price: 150,
    category: "পরিচয়পত্র সেবা",
    description: "জাতীয় পরিচয়পত্র আবেদন, সংশোধন ও নবায়ন",
    features: [
      "নতুন আবেদন প্রক্রিয়ায় দিকনির্দেশনা",
      "তথ্য সংশোধন আবেদন সহায়তা",
      "আবেদন কপি সংগ্রহ নির্দেশনা",
      "স্মার্ট কার্ড স্ট্যাটাস যাচাই",
    ],
  },
  {
    name: "NID হারানো কার্ড পুনরুদ্ধার",
    price: 120,
    category: "পরিচয়পত্র সেবা",
    description: "হারানো বা ক্ষতিগ্রস্ত NID পুনরায় সংগ্রহ সহায়তা",
    features: [
      "ডুপ্লিকেট আবেদন",
      "স্ট্যাটাস ট্র্যাকিং",
      "ডেলিভারি গাইডলাইন",
    ],
  },
  {
    name: "জন্ম নিবন্ধন সেবা",
    price: 100,
    category: "নিবন্ধন সেবা",
    description: "জন্ম নিবন্ধন সনদ আবেদন ও সংশোধন",
    features: [
      "নতুন জন্ম নিবন্ধন আবেদন",
      "নাম ও বয়স সংশোধন সহায়তা",
      "ইংরেজি ও বাংলা সনদ",
      "অনলাইন ভেরিফিকেশন",
    ],
  },
  {
    name: "জন্ম নিবন্ধন সংশোধন (Correction)",
    price: 130,
    category: "নিবন্ধন সেবা",
    description: "ভুল তথ্য সংশোধনের সহায়তা",
    features: [
      "নাম সংশোধন",
      "জন্ম তারিখ সংশোধন",
      "ডকুমেন্ট যাচাই",
    ],
  },
  {
    name: "ই-টিন নিবন্ধন",
    price: 180,
    category: "আর্থিক সেবা",
    description: "নতুন e-TIN সার্টিফিকেট",
    features: [
      "নতুন TIN আবেদন",
      "PDF সার্টিফিকেট",
      "তাৎক্ষণিক প্রসেসিং",
    ],
  },
  {
    name: "ট্যাক্স রিটার্ন সাবমিশন",
    price: 250,
    category: "আর্থিক সেবা",
    description: "আয়কর রিটার্ন প্রস্তুত ও জমা",
    features: [
      "Zero Return",
      "Income Calculation",
      "Online Submit",
    ],
  },
  {
    name: "ই-পাসপোর্ট সেবা",
    price: 350,
    category: "ভ্রমণ সেবা",
    description: "নতুন পাসপোর্ট আবেদন ও রিনিউ",
    features: [
      "নতুন আবেদন",
      "রিনিউ প্রসেস",
      "স্ট্যাটাস ট্র্যাকিং",
    ],
  },
  {
    name: "পুলিশ ক্লিয়ারেন্স",
    price: 300,
    category: "ভ্রমণ সেবা",
    description: "পুলিশ ক্লিয়ারেন্স সার্টিফিকেট সহায়তা",
    features: [
      "অনলাইন আবেদন",
      "ডকুমেন্ট যাচাই",
      "স্ট্যাটাস ট্র্যাকিং",
    ],
  },
  {
    name: "ট্রেড লাইসেন্স",
    price: 500,
    category: "ব্যবসা সেবা",
    description: "নতুন ট্রেড লাইসেন্স ও নবায়ন",
    features: [
      "নতুন লাইসেন্স",
      "রিনিউ",
      "ডকুমেন্ট প্রস্তুত",
    ],
  },
];

/* ---------------- FAQ ---------------- */
const FAQ_SEED = [
  {
    value: "q1",
    trigger: "আপনারা কি সরকারি ডাটাবেসে সরাসরি প্রবেশ করেন?",
    content: "না, আমরা শুধুমাত্র গাইডলাইন প্রদান করি।",
  },
  {
    value: "q2",
    trigger: "পেমেন্ট কিভাবে করবো?",
    content: "bKash, Nagad, Rocket বা Cash।",
  },
  {
    value: "q3",
    trigger: "ডেলিভারি টাইম কত?",
    content: "১-৭ কার্যদিবস।",
  },
  {
    value: "q4",
    trigger: "অনলাইন সাপোর্ট আছে?",
    content: "হ্যাঁ, WhatsApp ও Messenger এ সাপোর্ট দেওয়া হয়।",
  },
  {
    value: "q5",
    trigger: "ডকুমেন্ট কি কি লাগবে?",
    content: "সেবাভেদে প্রয়োজনীয় ডকুমেন্ট আলাদা হয়।",
  },
];

/* ---------------- LINKS ---------------- */
const LINKS_SEED = [
  {
    title: "NID সেবা",
    description: "জাতীয় পরিচয়পত্র অফিসিয়াল সাইট",
    image: null,
    link: "https://services.nidw.gov.bd/",
  },
  {
    title: "জন্ম নিবন্ধন",
    description: "BDRIS সরকারি পোর্টাল",
    image: null,
    link: "https://bdris.gov.bd/",
  },
  {
    title: "ই-পাসপোর্ট",
    description: "পাসপোর্ট আবেদন",
    image: null,
    link: "https://www.epassport.gov.bd/",
  },
  {
    title: "আয়কর বিভাগ",
    description: "TIN ও ট্যাক্স তথ্য",
    image: null,
    link: "https://nbr.gov.bd/",
  },
  {
    title: "পুলিশ ক্লিয়ারেন্স",
    description: "Police Clearance আবেদন",
    image: null,
    link: "https://pcc.police.gov.bd/",
  },
];

/* ---------------- HERO IMAGE ---------------- */
const HERO_IMAGES_SEED = [
  {
    image: "https://picsum.photos/1200/400?hero1",
  },
  {
    image: "https://picsum.photos/1200/400?hero2",
  },
  {
    image: "https://picsum.photos/1200/400?hero3",
  },
];

/* ---------------- NOTICE ---------------- */
const NOTICE_SEED = [
  {
    image: "https://picsum.photos/600/200?notice1",
  },
  {
    image: "https://picsum.photos/600/200?notice2",
  },
  {
    image: "https://picsum.photos/600/200?notice3",
  },
  {
    image: "https://picsum.photos/600/200?notice4",
  },
  {
    image: "https://picsum.photos/600/200?notice5",
  },
  {
    image: "https://picsum.photos/600/200?notice6",
  },
];

/* ---------------- BLOG ---------------- */
const BLOG_SEED = [
  {
    title: "NID সংশোধন করতে কী কী লাগে?",
    content: "সংশোধনের জন্য প্রয়োজনীয় ডকুমেন্ট থাকতে হবে...",
    image: "https://picsum.photos/400/300?1",
  },
  {
    title: "জন্ম নিবন্ধন অনলাইনে করবেন যেভাবে",
    content: "bdris.gov.bd থেকে সহজেই আবেদন করা যায়...",
    image: "https://picsum.photos/400/300?2",
  },
  {
    title: "TIN সার্টিফিকেট কেন দরকার?",
    content: "ব্যাংকিং ও ব্যবসার জন্য গুরুত্বপূর্ণ...",
    image: "https://picsum.photos/400/300?3",
  },
  {
    title: "পাসপোর্ট করতে কত সময় লাগে?",
    content: "সাধারণত ৭-১৫ দিন লাগে...",
    image: "https://picsum.photos/400/300?4",
  },
  {
    title: "ট্রেড লাইসেন্স কিভাবে করবেন?",
    content: "সিটি কর্পোরেশন থেকে আবেদন করতে হয়...",
    image: "https://picsum.photos/400/300?5",
  },
  {
    title: "পুলিশ ক্লিয়ারেন্স কিভাবে পাবেন?",
    content: "অনলাইনে আবেদন করে সংগ্রহ করা যায়...",
    image: "https://picsum.photos/400/300?6",
  },
];

async function main() {
  try {
    console.log("🚀 Starting Computer Corner seeding...");

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminEmail || !adminPassword) {
      throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set to seed admin.");
    }

    const saltRounds = Number(config.bcrypt_salt_number ?? 10);
    const hashedPassword = await bcrypt.hash(adminPassword, saltRounds);

    await prisma.user.upsert({
      where: { email: adminEmail },
      update: { role: Role.ADMIN, password: hashedPassword },
      create: { email: adminEmail, password: hashedPassword, role: Role.ADMIN },
    });
    console.log("✅ Admin upserted:", adminEmail);

    await prisma.service.createMany({ data: SERVICES_SEED, skipDuplicates: true });
    for (const faq of FAQ_SEED) {
      await prisma.faq.upsert({
        where: { value: faq.value },
        update: { trigger: faq.trigger, content: faq.content },
        create: faq,
      });
    }
    await prisma.link.createMany({ data: LINKS_SEED, skipDuplicates: true });
    await prisma.blog.createMany({ data: BLOG_SEED, skipDuplicates: true });

    await prisma.heroImage.createMany({
      data: HERO_IMAGES_SEED,
    });

    await prisma.notice.createMany({
      data: NOTICE_SEED,
    });

    console.log("✅ Seeding completed successfully!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
